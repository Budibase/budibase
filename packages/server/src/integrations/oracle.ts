import {
  FieldType,
  DatasourceFieldType,
  Integration,
  Operation,
  QueryType,
  SqlQuery,
  Table,
  DatasourcePlus,
  DatasourceFeature,
  ConnectionInfo,
  Schema,
  TableSourceType,
  Row,
  DatasourcePlusQueryResponse,
  SqlClient,
  EnrichedQueryJson,
} from "@budibase/types"
import {
  buildExternalTableId,
  checkExternalTables,
  generateColumnDefinition,
  finaliseExternalTables,
  getSqlQuery,
  HOST_ADDRESS,
} from "./utils"
import oracledb, {
  BindParameters,
  Connection,
  ConnectionAttributes,
  ExecuteOptions,
  Result,
} from "oracledb"
import {
  OracleTable,
  OracleColumn,
  OracleColumnsResponse,
  OracleTriggersResponse,
  TriggeringEvent,
  TriggerType,
} from "./base/types"
import { sql } from "@budibase/backend-core"

const Sql = sql.Sql

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

interface OracleConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
}

const SCHEMA: Integration = {
  docs: "https://github.com/oracle/node-oracledb",
  plus: true,
  friendlyName: "Oracle",
  type: "Relational",
  description:
    "Oracle Database is an object-relational database management system developed by Oracle Corporation",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
    [DatasourceFeature.FETCH_TABLE_NAMES]: true,
  },
  datasource: {
    host: {
      type: DatasourceFieldType.STRING,
      default: HOST_ADDRESS,
      required: true,
    },
    port: {
      type: DatasourceFieldType.NUMBER,
      required: true,
      default: 1521,
    },
    database: {
      type: DatasourceFieldType.STRING,
      required: true,
      display: "Service Name",
    },
    user: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      required: true,
    },
  },
  query: {
    create: {
      type: QueryType.SQL,
    },
    read: {
      type: QueryType.SQL,
    },
    update: {
      type: QueryType.SQL,
    },
    delete: {
      type: QueryType.SQL,
    },
  },
}

const UNSUPPORTED_TYPES = ["BLOB", "NCLOB"]

const OracleContraintTypes = {
  PRIMARY: "P",
  NOT_NULL_OR_CHECK: "C",
  FOREIGN_KEY: "R",
  UNIQUE: "U",
}

class OracleIntegration extends Sql implements DatasourcePlus {
  private readonly config: OracleConfig
  private index = 1

  private static readonly COLUMNS_SQL = `
    SELECT
      tabs.table_name,
      cols.column_name,
      cols.data_type,
      cols.data_default,
      cols.column_id,
      cons.constraint_name,
      cons.constraint_type,
      cons.r_constraint_name,
      cons.search_condition
    FROM
      user_tables tabs
    JOIN 
      user_tab_columns cols
      ON tabs.table_name = cols.table_name 
    LEFT JOIN 
      user_cons_columns col_cons
      ON cols.column_name = col_cons.column_name
      AND cols.table_name = col_cons.table_name
    LEFT JOIN 
      user_constraints cons
      ON col_cons.constraint_name = cons.constraint_name
      AND cons.table_name = cols.table_name
    WHERE
      (cons.status = 'ENABLED'
        OR cons.status IS NULL)
  `

  private static readonly TRIGGERS_SQL = `
    SELECT 
      table_name, 
      trigger_name, 
      trigger_type, 
      triggering_event, 
      trigger_body 
    FROM 
      all_triggers 
    WHERE status = 'ENABLED'
  `

  constructor(config: OracleConfig) {
    super(SqlClient.ORACLE)
    this.config = config
  }

  getBindingIdentifier(): string {
    return `:${this.index++}`
  }

  getStringConcat(parts: string[]): string {
    return parts.join(" || ")
  }

  /**
   * Map the flat tabular columns and constraints data into a nested object
   */
  private mapColumns(result: Result<OracleColumnsResponse>): {
    [key: string]: OracleTable
  } {
    const oracleTables: { [key: string]: OracleTable } = {}

    if (result.rows) {
      result.rows.forEach(row => {
        const tableName = row.TABLE_NAME
        const columnName = row.COLUMN_NAME
        const dataType = row.DATA_TYPE
        const dataDefault = row.DATA_DEFAULT
        const columnId = row.COLUMN_ID
        const constraintName = row.CONSTRAINT_NAME
        const constraintType = row.CONSTRAINT_TYPE
        const relatedConstraintName = row.R_CONSTRAINT_NAME
        const searchCondition = row.SEARCH_CONDITION

        let table = oracleTables[tableName]
        if (!table) {
          table = {
            name: tableName,
            columns: {},
          }
          oracleTables[tableName] = table
        }

        let column = table.columns[columnName]
        if (!column) {
          column = {
            name: columnName,
            type: dataType,
            default: dataDefault,
            id: columnId,
            constraints: {},
          }
          table.columns[columnName] = column
        }

        if (constraintName && constraintType) {
          let constraint = column.constraints[constraintName]
          if (!constraint) {
            constraint = {
              name: constraintName,
              type: constraintType,
              relatedConstraintName: relatedConstraintName,
              searchCondition: searchCondition,
            }
          }
          column.constraints[constraintName] = constraint
        }
      })
    }

    return oracleTables
  }

  private getTriggersFor(
    tableName: string,
    triggersResponse: Result<OracleTriggersResponse>,
    opts?: { event?: TriggeringEvent; type?: TriggerType }
  ): OracleTriggersResponse[] {
    const triggers: OracleTriggersResponse[] = []
    for (const trigger of triggersResponse.rows || []) {
      if (trigger.TABLE_NAME !== tableName) {
        continue
      }
      if (opts?.event && opts.event !== trigger.TRIGGERING_EVENT) {
        continue
      }
      if (opts?.type && opts.type !== trigger.TRIGGER_TYPE) {
        continue
      }
      triggers.push(trigger)
    }
    return triggers
  }

  private markAutoIncrementColumns(
    triggersResponse: Result<OracleTriggersResponse>,
    tables: Record<string, Table>
  ) {
    for (const table of Object.values(tables)) {
      const triggers = this.getTriggersFor(table.name, triggersResponse, {
        type: TriggerType.BEFORE_EACH_ROW,
        event: TriggeringEvent.INSERT,
      })

      // This is the trigger body Knex generates for an auto increment column
      // called "id" on a table called "foo":
      //
      //   declare checking number := 1;
      //   begin if (:new. "id" is null) then while checking >= 1 loop
      //   select
      //       "foo_seq".nextval into :new. "id"
      //   from
      //       dual;
      //   select
      //       count("id") into checking
      //   from
      //       "foo"
      //   where
      //       "id" = :new. "id";
      //   end loop;
      //   end if;
      //   end;
      for (const [columnName, schema] of Object.entries(table.schema)) {
        const autoIncrementTriggers = triggers.filter(
          trigger =>
            // This is a bit heuristic, but I think it's the best we can do with
            // the information we have. We're looking for triggers that run
            // before each row is inserted, and that have a body that contains a
            // call to a function that generates a new value for the column.  We
            // also check that the column name is in the trigger body, to make
            // sure we're not picking up triggers that don't affect the column.
            trigger.TRIGGER_BODY.includes(`"${columnName}"`) &&
            trigger.TRIGGER_BODY.includes(`.nextval`)
        )

        if (autoIncrementTriggers.length > 0) {
          schema.autocolumn = true
        }
      }
    }
  }

  private static isSupportedColumn(column: OracleColumn) {
    return !UNSUPPORTED_TYPES.includes(column.type)
  }

  private static isAutoColumn(column: OracleColumn) {
    return !!(
      column.default && column.default.toLowerCase().includes("nextval")
    )
  }

  /**
   * No native boolean in oracle. Best we can do is to check if a manual 1 or 0 number constraint has been set up
   * This matches the default behaviour for generating DDL used in knex.
   */
  private isBooleanType(column: OracleColumn): boolean {
    return (
      column.type.toLowerCase() === "number" &&
      Object.values(column.constraints).filter(c => {
        if (
          c.type === OracleContraintTypes.NOT_NULL_OR_CHECK &&
          c.searchCondition
        ) {
          const condition = c.searchCondition
            .replace(/\s/g, "") // remove spaces
            .replace(/[']+/g, "") // remove quotes
          if (condition.includes("in(0,1)") || condition.includes("in(1,0)")) {
            return true
          }
        }
        return false
      }).length > 0
    )
  }

  /**
   * Fetches the tables from the oracle table and assigns them to the datasource.
   * @param datasourceId - datasourceId to fetch
   * @param entities - the tables that are to be built
   */
  async buildSchema(
    datasourceId: string,
    entities: Record<string, Table>
  ): Promise<Schema> {
    const columnsResponse = await this.internalQuery<OracleColumnsResponse>({
      sql: OracleIntegration.COLUMNS_SQL,
    })
    const triggersResponse = await this.internalQuery<OracleTriggersResponse>({
      sql: OracleIntegration.TRIGGERS_SQL,
    })
    const oracleTables = this.mapColumns(columnsResponse)

    const tables: { [key: string]: Table } = {}

    // iterate each table
    Object.values(oracleTables).forEach(oracleTable => {
      let table = tables[oracleTable.name]
      if (!table) {
        table = {
          type: "table",
          _id: buildExternalTableId(datasourceId, oracleTable.name),
          primary: [],
          name: oracleTable.name,
          schema: {},
          sourceId: datasourceId,
          sourceType: TableSourceType.EXTERNAL,
        }
        tables[oracleTable.name] = table
      }

      // iterate each column on the table
      Object.values(oracleTable.columns)
        // remove columns that we can't read / save
        .filter(oracleColumn =>
          OracleIntegration.isSupportedColumn(oracleColumn)
        )
        // match the order of the columns in the db
        .sort((c1, c2) => c1.id - c2.id)
        .forEach(oracleColumn => {
          const columnName = oracleColumn.name
          let fieldSchema = table.schema[columnName]
          if (!fieldSchema) {
            fieldSchema = generateColumnDefinition({
              autocolumn: OracleIntegration.isAutoColumn(oracleColumn),
              name: columnName,
              presence: false,
              externalType: oracleColumn.type,
            })

            if (this.isBooleanType(oracleColumn)) {
              fieldSchema.type = FieldType.BOOLEAN
            }

            table.schema[columnName] = fieldSchema
          }

          // iterate each constraint on the column
          Object.values(oracleColumn.constraints).forEach(oracleConstraint => {
            if (oracleConstraint.type === OracleContraintTypes.PRIMARY) {
              table.primary!.push(columnName)
            } else if (
              oracleConstraint.type ===
                OracleContraintTypes.NOT_NULL_OR_CHECK &&
              oracleConstraint.searchCondition?.endsWith("IS NOT NULL")
            ) {
              table.schema[columnName].constraints = {
                presence: true,
              }
            }
          })
        })
    })

    this.markAutoIncrementColumns(triggersResponse, tables)

    let externalTables = finaliseExternalTables(tables, entities)
    let errors = checkExternalTables(externalTables)
    return { tables: externalTables, errors }
  }

  async getTableNames() {
    const columnsResponse = await this.internalQuery<OracleColumnsResponse>({
      sql: OracleIntegration.COLUMNS_SQL,
    })
    const tableNames = new Set<string>()
    for (const row of columnsResponse.rows || []) {
      tableNames.add(row.TABLE_NAME)
    }
    return Array.from(tableNames)
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    let connection
    try {
      connection = await this.getConnection()
      response.connected = true
    } catch (err: any) {
      response.connected = false
      response.error = err.message
    } finally {
      if (connection) {
        try {
          await connection.close()
        } catch (err: any) {
          response.connected = false
          response.error = err.message
        }
      }
    }
    return response
  }

  private async internalQuery<T>(query: SqlQuery): Promise<Result<T>> {
    let connection
    try {
      this.index = 1
      connection = await this.getConnection()

      const options: ExecuteOptions = {
        autoCommit: true,
        fetchTypeHandler: function (metaData) {
          if (metaData.dbType === oracledb.CLOB) {
            return { type: oracledb.STRING }
          } else if (
            // When we create a new table in OracleDB from Budibase, bigints get
            // created as NUMBER(20,0). Budibase expects bigints to be returned
            // as strings, which is what we're doing here. However, this is
            // likely to be brittle if we connect to externally created
            // databases that have used different precisions and scales.
            // We shold find a way to do better.
            metaData.dbType === oracledb.NUMBER &&
            metaData.precision === 20 &&
            metaData.scale === 0
          ) {
            return { type: oracledb.STRING }
          }
          return undefined
        },
      }
      const bindings: BindParameters = query.bindings || []

      this.log(query.sql, bindings)
      const result = await connection.execute(query.sql, bindings, options)
      return result as Result<T>
    } finally {
      if (connection) {
        try {
          await connection.close()
        } catch (err) {
          console.error("Error connecting to Oracle", err)
        }
      }
    }
  }

  private getConnection = async (): Promise<Connection> => {
    const connectString = `${this.config.host}:${this.config.port || 1521}/${
      this.config.database
    }`
    const attributes: ConnectionAttributes = {
      user: this.config.user,
      password: this.config.password,
      connectString,
    }

    // We set the timezone of the connection to match the timezone of the
    // Budibase server, this is because several column types (e.g. time-only
    // timestamps) do not store timezone information, so to avoid storing one
    // time and getting a different one back we need to make sure the timezone
    // of the server matches the timezone of the database. There's an assumption
    // here that the server is running in the same timezone as the database.
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const connection = await oracledb.getConnection(attributes)
    await connection.execute(`ALTER SESSION SET TIME_ZONE = '${tz}'`)
    return connection
  }

  async create(query: SqlQuery | string): Promise<any[]> {
    const response = await this.internalQuery<any>(getSqlQuery(query))
    return response.rows && response.rows.length
      ? response.rows
      : [{ created: true }]
  }

  async read(query: SqlQuery | string): Promise<any[]> {
    const response = await this.internalQuery<any>(getSqlQuery(query))
    return response.rows ? response.rows : []
  }

  async update(query: SqlQuery | string): Promise<any[]> {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows && response.rows.length
      ? response.rows
      : [{ updated: true }]
  }

  async delete(query: SqlQuery | string): Promise<any[]> {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows && response.rows.length
      ? response.rows
      : [{ deleted: true }]
  }

  async query(json: EnrichedQueryJson): Promise<DatasourcePlusQueryResponse> {
    const operation = this._operation(json)
    const input = this._query(json, { disableReturning: true }) as SqlQuery
    if (Array.isArray(input)) {
      const responses = []
      for (let query of input) {
        responses.push(await this.internalQuery(query))
      }
      return responses
    } else {
      // read the row to be deleted up front for the return
      let deletedRows
      if (operation === Operation.DELETE) {
        const queryFn = (query: any) => this.internalQuery(query)
        deletedRows = await this.getReturningRow(queryFn, json)
      }

      // run the query
      const response = await this.internalQuery(input)

      // get the results or return the created / updated / deleted row
      if (deletedRows?.rows?.length) {
        return deletedRows.rows
      } else if (response.rows?.length) {
        return response.rows as Row[]
      } else {
        // get the last row that was updated
        if (response.lastRowid && operation !== Operation.DELETE) {
          const lastRow = await this.internalQuery({
            sql: `SELECT * FROM "${json.table.name}" WHERE ROWID = '${response.lastRowid}'`,
          })
          return lastRow.rows as Row[]
        } else {
          return [{ [operation.toLowerCase()]: true }]
        }
      }
    }
  }
}

export default {
  schema: SCHEMA,
  integration: OracleIntegration,
}

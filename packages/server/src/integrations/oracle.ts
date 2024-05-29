import {
  FieldType,
  DatasourceFieldType,
  Integration,
  Operation,
  QueryJson,
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
} from "@budibase/types"
import {
  buildExternalTableId,
  checkExternalTables,
  generateColumnDefinition,
  finaliseExternalTables,
  getSqlQuery,
  HOST_ADDRESS,
} from "./utils"
import {
  BindParameters,
  Connection,
  ConnectionAttributes,
  ExecuteOptions,
  Result,
} from "oracledb"
import { OracleTable, OracleColumn, OracleColumnsResponse } from "./base/types"
import { sql } from "@budibase/backend-core"

const Sql = sql.Sql

let oracledb: any
try {
  oracledb = require("oracledb")
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
} catch (err) {
  console.log("ORACLEDB is not installed")
}

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

const UNSUPPORTED_TYPES = ["BLOB", "CLOB", "NCLOB"]

const OracleContraintTypes = {
  PRIMARY: "P",
  NOT_NULL_OR_CHECK: "C",
  FOREIGN_KEY: "R",
  UNIQUE: "U",
}

class OracleIntegration extends Sql implements DatasourcePlus {
  private readonly config: OracleConfig
  private index: number = 1

  private readonly COLUMNS_SQL = `
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

  static isInstalled() {
    return oracledb != null
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
      sql: this.COLUMNS_SQL,
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
              oracleConstraint.type === OracleContraintTypes.NOT_NULL_OR_CHECK
            ) {
              table.schema[columnName].constraints = {
                presence: true,
              }
            }
          })
        })
    })

    let externalTables = finaliseExternalTables(tables, entities)
    let errors = checkExternalTables(externalTables)
    return { tables: externalTables, errors }
  }

  async getTableNames() {
    const columnsResponse = await this.internalQuery<OracleColumnsResponse>({
      sql: this.COLUMNS_SQL,
    })
    return (columnsResponse.rows || []).map(row => row.TABLE_NAME)
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

      const options: ExecuteOptions = { autoCommit: true }
      const bindings: BindParameters = query.bindings || []

      this.log(query.sql, bindings)
      return await connection.execute<T>(query.sql, bindings, options)
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
    //connectString : "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(CONNECT_DATA =(SID= ORCL)))"
    const connectString = `${this.config.host}:${this.config.port || 1521}/${
      this.config.database
    }`
    const attributes: ConnectionAttributes = {
      user: this.config.user,
      password: this.config.password,
      connectString,
    }
    return oracledb.getConnection(attributes)
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

  async query(json: QueryJson): Promise<DatasourcePlusQueryResponse> {
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
        if (
          response.lastRowid &&
          json.endpoint?.entityId &&
          operation !== Operation.DELETE
        ) {
          const lastRow = await this.internalQuery({
            sql: `SELECT * FROM "${json.endpoint.entityId}" WHERE ROWID = '${response.lastRowid}'`,
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

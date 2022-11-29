import {
  DatasourceFieldType,
  Integration,
  Operation,
  Table,
  TableSchema,
  QueryJson,
  QueryType,
  SqlQuery,
  DatasourcePlus,
} from "@budibase/types"
import {
  getSqlQuery,
  buildExternalTableId,
  convertSqlType,
  finaliseExternalTables,
  SqlClient,
} from "./utils"
import Sql from "./base/sql"

const sqlServer = require("mssql")
const DEFAULT_SCHEMA = "dbo"

interface MSSQLConfig {
  user: string
  password: string
  server: string
  port: number
  database: string
  schema: string
  encrypt?: boolean
}

interface TablesResponse {
  TABLE_CATALOG: string
  TABLE_SCHEMA: string
  TABLE_NAME: string
  TABLE_TYPE: string
}

const SCHEMA: Integration = {
  docs: "https://github.com/tediousjs/node-mssql",
  plus: true,
  description:
    "Microsoft SQL Server is a relational database management system developed by Microsoft. ",
  friendlyName: "MS SQL Server",
  type: "Relational",
  datasource: {
    user: {
      type: DatasourceFieldType.STRING,
      required: true,
      default: "localhost",
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      required: true,
    },
    server: {
      type: DatasourceFieldType.STRING,
      default: "localhost",
    },
    port: {
      type: DatasourceFieldType.NUMBER,
      required: false,
      default: 1433,
    },
    database: {
      type: DatasourceFieldType.STRING,
      default: "root",
    },
    schema: {
      type: DatasourceFieldType.STRING,
      default: DEFAULT_SCHEMA,
    },
    encrypt: {
      type: DatasourceFieldType.BOOLEAN,
      default: true,
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

class SqlServerIntegration extends Sql implements DatasourcePlus {
  private readonly config: MSSQLConfig
  private index: number = 0
  private readonly pool: any
  private client: any
  public tables: Record<string, Table> = {}
  public schemaErrors: Record<string, string> = {}

  MASTER_TABLES = [
    "spt_fallback_db",
    "spt_fallback_dev",
    "spt_fallback_usg",
    "spt_monitor",
    "MSreplication_options",
  ]
  TABLES_SQL =
    "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"

  constructor(config: MSSQLConfig) {
    super(SqlClient.MS_SQL)
    this.config = config
    const clientCfg = {
      ...this.config,
      options: {
        encrypt: this.config.encrypt,
        enableArithAbort: true,
      },
    }
    delete clientCfg.encrypt
    if (!this.pool) {
      this.pool = new sqlServer.ConnectionPool(clientCfg)
    }
  }

  getBindingIdentifier(): string {
    return `@p${this.index++}`
  }

  getStringConcat(parts: string[]): string {
    return `concat(${parts.join(", ")})`
  }

  async connect() {
    try {
      this.client = await this.pool.connect()
    } catch (err) {
      // @ts-ignore
      throw new Error(err)
    }
  }

  async internalQuery(
    query: SqlQuery,
    operation: string | undefined = undefined
  ) {
    const client = this.client
    const request = client.request()
    this.index = 0
    try {
      if (Array.isArray(query.bindings)) {
        let count = 0
        for (let binding of query.bindings) {
          request.input(`p${count++}`, binding)
        }
      }
      // this is a hack to get the inserted ID back,
      //  no way to do this with Knex nicely
      const sql =
        operation === Operation.CREATE
          ? `${query.sql}; SELECT SCOPE_IDENTITY() AS id;`
          : query.sql
      return await request.query(sql)
    } catch (err) {
      // @ts-ignore
      throw new Error(err)
    }
  }

  getDefinitionSQL(tableName: string) {
    return `select *
            from INFORMATION_SCHEMA.COLUMNS
            where TABLE_NAME='${tableName}'`
  }

  getConstraintsSQL(tableName: string) {
    return `SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC 
            INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KU
              ON TC.CONSTRAINT_TYPE = 'PRIMARY KEY' 
              AND TC.CONSTRAINT_NAME = KU.CONSTRAINT_NAME 
              AND KU.table_name='${tableName}'
            ORDER BY 
              KU.TABLE_NAME,
              KU.ORDINAL_POSITION;`
  }

  getAutoColumnsSQL(tableName: string) {
    return `SELECT 
            COLUMNPROPERTY(OBJECT_ID(TABLE_SCHEMA+'.'+TABLE_NAME),COLUMN_NAME,'IsComputed') 
              AS IS_COMPUTED,
            COLUMNPROPERTY(object_id(TABLE_SCHEMA+'.'+TABLE_NAME), COLUMN_NAME, 'IsIdentity')
              AS IS_IDENTITY,
            *
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME='${tableName}'`
  }

  async runSQL(sql: string) {
    return (await this.internalQuery(getSqlQuery(sql))).recordset
  }

  /**
   * Fetches the tables from the sql server database and assigns them to the datasource.
   * @param {*} datasourceId - datasourceId to fetch
   * @param entities - the tables that are to be built
   */
  async buildSchema(datasourceId: string, entities: Record<string, Table>) {
    await this.connect()
    let tableInfo: TablesResponse[] = await this.runSQL(this.TABLES_SQL)
    if (tableInfo == null || !Array.isArray(tableInfo)) {
      throw "Unable to get list of tables in database"
    }

    const schema = this.config.schema || DEFAULT_SCHEMA
    const tableNames = tableInfo
      .filter((record: any) => record.TABLE_SCHEMA === schema)
      .map((record: any) => record.TABLE_NAME)
      .filter((name: string) => this.MASTER_TABLES.indexOf(name) === -1)

    const tables: Record<string, Table> = {}
    for (let tableName of tableNames) {
      // get the column definition (type)
      const definition = await this.runSQL(this.getDefinitionSQL(tableName))
      // find primary key constraints
      const constraints = await this.runSQL(this.getConstraintsSQL(tableName))
      // find the computed and identity columns (auto columns)
      const columns = await this.runSQL(this.getAutoColumnsSQL(tableName))
      const primaryKeys = constraints
        .filter(
          (constraint: any) => constraint.CONSTRAINT_TYPE === "PRIMARY KEY"
        )
        .map((constraint: any) => constraint.COLUMN_NAME)
      const autoColumns = columns
        .filter((col: any) => col.IS_COMPUTED || col.IS_IDENTITY)
        .map((col: any) => col.COLUMN_NAME)

      let schema: TableSchema = {}
      for (let def of definition) {
        const name = def.COLUMN_NAME
        if (typeof name !== "string") {
          continue
        }
        schema[name] = {
          autocolumn: !!autoColumns.find((col: string) => col === name),
          name: name,
          ...convertSqlType(def.DATA_TYPE),
          externalType: def.DATA_TYPE,
        }
      }
      tables[tableName] = {
        _id: buildExternalTableId(datasourceId, tableName),
        primary: primaryKeys,
        name: tableName,
        schema,
      }
    }
    const final = finaliseExternalTables(tables, entities)
    this.tables = final.tables
    this.schemaErrors = final.errors
  }

  async read(query: SqlQuery | string) {
    await this.connect()
    const response = await this.internalQuery(getSqlQuery(query))
    return response.recordset
  }

  async create(query: SqlQuery | string) {
    await this.connect()
    const response = await this.internalQuery(getSqlQuery(query))
    return response.recordset || [{ created: true }]
  }

  async update(query: SqlQuery | string) {
    await this.connect()
    const response = await this.internalQuery(getSqlQuery(query))
    return response.recordset || [{ updated: true }]
  }

  async delete(query: SqlQuery | string) {
    await this.connect()
    const response = await this.internalQuery(getSqlQuery(query))
    return response.recordset || [{ deleted: true }]
  }

  async query(json: QueryJson) {
    const schema = this.config.schema
    await this.connect()
    if (schema && schema !== DEFAULT_SCHEMA && json?.endpoint) {
      json.endpoint.schema = schema
    }
    const operation = this._operation(json)
    const queryFn = (query: any, op: string) => this.internalQuery(query, op)
    const processFn = (result: any) =>
      result.recordset ? result.recordset : [{ [operation]: true }]
    return this.queryWithReturning(json, queryFn, processFn)
  }
}

export default {
  schema: SCHEMA,
  integration: SqlServerIntegration,
}

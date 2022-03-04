import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
  QueryJson,
  SqlQuery,
} from "../definitions/datasource"
import { Table, TableSchema } from "../definitions/common"
import {
  getSqlQuery,
  SqlClients,
  buildExternalTableId,
  convertSqlType,
  finaliseExternalTables,
} from "./utils"
import { DatasourcePlus } from "./base/datasourcePlus"

module MySQLModule {
  const mysql = require("mysql2/promise")
  const Sql = require("./base/sql")

  interface MySQLConfig {
    host: string
    port: number
    user: string
    password: string
    database: string
    ssl?: object
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/sidorares/node-mysql2",
    plus: true,
    friendlyName: "MySQL",
    description:
      "MySQL Database Service is a fully managed database service to deploy cloud-native applications. ",
    datasource: {
      host: {
        type: DatasourceFieldTypes.STRING,
        default: "localhost",
        required: true,
      },
      port: {
        type: DatasourceFieldTypes.NUMBER,
        default: 3306,
        required: false,
      },
      user: {
        type: DatasourceFieldTypes.STRING,
        default: "root",
        required: true,
      },
      password: {
        type: DatasourceFieldTypes.PASSWORD,
        default: "root",
        required: true,
      },
      database: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      ssl: {
        type: DatasourceFieldTypes.OBJECT,
        required: false,
      },
    },
    query: {
      create: {
        type: QueryTypes.SQL,
      },
      read: {
        type: QueryTypes.SQL,
      },
      update: {
        type: QueryTypes.SQL,
      },
      delete: {
        type: QueryTypes.SQL,
      },
    },
  }

  class MySQLIntegration extends Sql implements DatasourcePlus {
    private config: MySQLConfig
    private client: any
    public tables: Record<string, Table> = {}
    public schemaErrors: Record<string, string> = {}

    constructor(config: MySQLConfig) {
      super(SqlClients.MY_SQL)
      this.config = config
      if (config.ssl && Object.keys(config.ssl).length === 0) {
        delete config.ssl
      }
      this.config = config
    }

    getBindingIdentifier(): string {
      return "?"
    }

    async connect() {
      this.client = await mysql.createConnection(this.config)
    }

    async disconnect() {
      await this.client.end()
    }

    async internalQuery(
      query: SqlQuery,
      connect: boolean = true
    ): Promise<any[] | any> {
      try {
        if (connect) {
          await this.connect()
        }
        // Node MySQL is callback based, so we must wrap our call in a promise
        const response = await this.client.query(
          query.sql,
          query.bindings || []
        )
        return response[0]
      } finally {
        if (connect) {
          await this.disconnect()
        }
      }
    }

    async buildSchema(datasourceId: string, entities: Record<string, Table>) {
      const tables: { [key: string]: Table } = {}
      const database = this.config.database
      await this.connect()

      try {
        // get the tables first
        const tablesResp = await this.internalQuery(
          { sql: "SHOW TABLES;" },
          false
        )
        const tableNames = tablesResp.map(
          (obj: any) =>
            obj[`Tables_in_${database}`] ||
            obj[`Tables_in_${database.toLowerCase()}`]
        )
        for (let tableName of tableNames) {
          const primaryKeys = []
          const schema: TableSchema = {}
          const descResp = await this.internalQuery(
            { sql: `DESCRIBE \`${tableName}\`;` },
            false
          )
          for (let column of descResp) {
            const columnName = column.Field
            if (
              column.Key === "PRI" &&
              primaryKeys.indexOf(column.Key) === -1
            ) {
              primaryKeys.push(columnName)
            }
            const constraints = {
              presence: column.Null !== "YES",
            }
            const isAuto: boolean =
              typeof column.Extra === "string" &&
              (column.Extra === "auto_increment" ||
                column.Extra.toLowerCase().includes("generated"))
            schema[columnName] = {
              name: columnName,
              autocolumn: isAuto,
              type: convertSqlType(column.Type),
              constraints,
            }
          }
          if (!tables[tableName]) {
            tables[tableName] = {
              _id: buildExternalTableId(datasourceId, tableName),
              primary: primaryKeys,
              name: tableName,
              schema,
            }
          }
        }
      } finally {
        await this.disconnect()
      }
      const final = finaliseExternalTables(tables, entities)
      this.tables = final.tables
      this.schemaErrors = final.errors
    }

    async create(query: SqlQuery | string) {
      const results = await this.internalQuery(getSqlQuery(query))
      return results.length ? results : [{ created: true }]
    }

    async read(query: SqlQuery | string) {
      return this.internalQuery(getSqlQuery(query))
    }

    async update(query: SqlQuery | string) {
      const results = await this.internalQuery(getSqlQuery(query))
      return results.length ? results : [{ updated: true }]
    }

    async delete(query: SqlQuery | string) {
      const results = await this.internalQuery(getSqlQuery(query))
      return results.length ? results : [{ deleted: true }]
    }

    async query(json: QueryJson) {
      await this.connect()
      try {
        const queryFn = (query: any) => this.internalQuery(query, false)
        return await this.queryWithReturning(json, queryFn)
      } finally {
        await this.disconnect()
      }
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: MySQLIntegration,
  }
}

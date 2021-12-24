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
  const mysql = require("mysql2")
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
    docs: "https://github.com/mysqljs/mysql",
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

  function internalQuery(
    client: any,
    query: SqlQuery,
    connect: boolean = true
  ): Promise<any[] | any> {
    // Node MySQL is callback based, so we must wrap our call in a promise
    return new Promise((resolve, reject) => {
      if (connect) {
        client.connect()
      }
      return client.query(
        query.sql,
        query.bindings || {},
        (error: any, results: object[]) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
          if (connect) {
            client.end()
          }
        }
      )
    })
  }

  class MySQLIntegration extends Sql implements DatasourcePlus {
    private config: MySQLConfig
    private readonly client: any
    public tables: Record<string, Table> = {}
    public schemaErrors: Record<string, string> = {}

    constructor(config: MySQLConfig) {
      super(SqlClients.MY_SQL)
      this.config = config
      if (config.ssl && Object.keys(config.ssl).length === 0) {
        delete config.ssl
      }
      this.client = mysql.createConnection(config)
    }

    async buildSchema(datasourceId: string, entities: Record<string, Table>) {
      const tables: { [key: string]: Table } = {}
      const database = this.config.database
      this.client.connect()

      // get the tables first
      const tablesResp = await internalQuery(
        this.client,
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
        const descResp = await internalQuery(
          this.client,
          { sql: `DESCRIBE \`${tableName}\`;` },
          false
        )
        for (let column of descResp) {
          const columnName = column.Field
          if (column.Key === "PRI" && primaryKeys.indexOf(column.Key) === -1) {
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

      this.client.end()
      const final = finaliseExternalTables(tables, entities)
      this.tables = final.tables
      this.schemaErrors = final.errors
    }

    async create(query: SqlQuery | string) {
      const results = await internalQuery(this.client, getSqlQuery(query))
      return results.length ? results : [{ created: true }]
    }

    async read(query: SqlQuery | string) {
      return internalQuery(this.client, getSqlQuery(query))
    }

    async update(query: SqlQuery | string) {
      const results = await internalQuery(this.client, getSqlQuery(query))
      return results.length ? results : [{ updated: true }]
    }

    async delete(query: SqlQuery | string) {
      const results = await internalQuery(this.client, getSqlQuery(query))
      return results.length ? results : [{ deleted: true }]
    }

    async query(json: QueryJson) {
      this.client.connect()
      const queryFn = (query: any) => internalQuery(this.client, query, false)
      const output = await this.queryWithReturning(json, queryFn)
      this.client.end()
      return output
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: MySQLIntegration,
  }
}

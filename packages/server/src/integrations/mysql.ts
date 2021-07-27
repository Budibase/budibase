import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
  Operation,
  QueryJson,
  SqlQuery,
} from "../definitions/datasource"
import { Table, TableSchema } from "../definitions/common"
import { getSqlQuery } from "./utils"

module MySQLModule {
  const mysql = require("mysql")
  const Sql = require("./base/sql")
  const { buildExternalTableId, convertType } = require("./utils")
  const { FieldTypes } = require("../constants")

  interface MySQLConfig {
    host: string
    port: number
    user: string
    password: string
    database: string
    ssl?: object
  }

  const TYPE_MAP = {
    text: FieldTypes.LONGFORM,
    blob: FieldTypes.LONGFORM,
    enum: FieldTypes.STRING,
    varchar: FieldTypes.STRING,
    float: FieldTypes.NUMBER,
    int: FieldTypes.NUMBER,
    numeric: FieldTypes.NUMBER,
    bigint: FieldTypes.NUMBER,
    mediumint: FieldTypes.NUMBER,
    decimal: FieldTypes.NUMBER,
    dec: FieldTypes.NUMBER,
    double: FieldTypes.NUMBER,
    real: FieldTypes.NUMBER,
    fixed: FieldTypes.NUMBER,
    smallint: FieldTypes.NUMBER,
    timestamp: FieldTypes.DATETIME,
    date: FieldTypes.DATETIME,
    datetime: FieldTypes.DATETIME,
    time: FieldTypes.DATETIME,
    tinyint: FieldTypes.BOOLEAN,
    json: DatasourceFieldTypes.JSON,
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
  ): Promise<any[]> {
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

  class MySQLIntegration extends Sql {
    private config: MySQLConfig
    private readonly client: any

    constructor(config: MySQLConfig) {
      super("mysql")
      this.config = config
      if (config.ssl && Object.keys(config.ssl).length === 0) {
        delete config.ssl
      }
      this.client = mysql.createConnection(config)
    }

    async buildSchema(datasourceId: string) {
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
        (obj: any) => obj[`Tables_in_${database}`]
      )
      for (let tableName of tableNames) {
        const primaryKeys = []
        const schema: TableSchema = {}
        const descResp = await internalQuery(
          this.client,
          { sql: `DESCRIBE ${tableName};` },
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
            type: convertType(column.Type, TYPE_MAP),
            constraints,
          }
        }
        // for now just default to first column
        if (primaryKeys.length === 0) {
          primaryKeys.push(descResp[0].Field)
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
      this.tables = tables
    }

    async create(query: SqlQuery | string) {
      const results = await internalQuery(this.client, getSqlQuery(query))
      return results.length ? results : [{ created: true }]
    }

    read(query: SqlQuery | string) {
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

    async getReturningRow(json: QueryJson) {
      if (!json.extra || !json.extra.idFilter) {
        return {}
      }
      const input = this._query({
        endpoint: {
          ...json.endpoint,
          operation: Operation.READ,
        },
        fields: [],
        filters: json.extra.idFilter,
        paginate: {
          limit: 1,
        },
      })
      return internalQuery(this.client, input, false)
    }

    async query(json: QueryJson) {
      const operation = this._operation(json)
      this.client.connect()
      const input = this._query(json, { disableReturning: true })
      let row
      // need to manage returning, a feature mySQL can't do
      if (operation === "awdawd") {
        row = this.getReturningRow(json)
      }
      const results = await internalQuery(this.client, input, false)
      // same as delete, manage returning
      if (operation === Operation.CREATE || operation === Operation.UPDATE) {
        row = this.getReturningRow(json)
      }
      this.client.end()
      if (operation !== Operation.READ) {
        return row
      }
      return results.length ? results : [{ [operation.toLowerCase()]: true }]
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: MySQLIntegration,
  }
}

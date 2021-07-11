import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
  QueryJson,
  SqlQuery,
} from "../definitions/datasource"
import { getSqlQuery } from "./utils"

module MSSQLModule {
  const sqlServer = require("mssql")
  const Sql = require("./base/sql")

  interface MSSQLConfig {
    user: string
    password: string
    server: string
    port: number
    database: string
    encrypt?: boolean
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/tediousjs/node-mssql",
    description:
      "Microsoft SQL Server is a relational database management system developed by Microsoft. ",
    friendlyName: "MS SQL Server",
    datasource: {
      user: {
        type: DatasourceFieldTypes.STRING,
        required: true,
        default: "localhost",
      },
      password: {
        type: DatasourceFieldTypes.PASSWORD,
        required: true,
      },
      server: {
        type: DatasourceFieldTypes.STRING,
        default: "localhost",
      },
      port: {
        type: DatasourceFieldTypes.NUMBER,
        required: false,
        default: 1433,
      },
      database: {
        type: DatasourceFieldTypes.STRING,
        default: "root",
      },
      encrypt: {
        type: DatasourceFieldTypes.BOOLEAN,
        default: true,
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

  async function internalQuery(client: any, query: SqlQuery) {
    try {
      return await client.query(query.sql, query.bindings || {})
    } catch (err) {
      throw new Error(err)
    }
  }

  class SqlServerIntegration extends Sql {
    private readonly config: MSSQLConfig
    static pool: any

    constructor(config: MSSQLConfig) {
      super("mssql")
      this.config = config
      const clientCfg = {
        ...this.config,
        options: {
          encrypt: this.config.encrypt,
        },
      }
      delete clientCfg.encrypt
      if (!this.pool) {
        this.pool = new sqlServer.ConnectionPool(clientCfg)
      }
    }

    async connect() {
      try {
        const client = await this.pool.connect()
        this.client = client.request()
      } catch (err) {
        throw new Error(err)
      }
    }

    async read(query: SqlQuery | string) {
      await this.connect()
      const response = await internalQuery(this.client, getSqlQuery(query))
      return response.recordset
    }

    async create(query: SqlQuery | string) {
      await this.connect()
      const response = await internalQuery(this.client, getSqlQuery(query))
      return response.recordset || [{ created: true }]
    }

    async update(query: SqlQuery | string) {
      await this.connect()
      const response = await internalQuery(this.client, getSqlQuery(query))
      return response.recordset || [{ updated: true }]
    }

    async delete(query: SqlQuery | string) {
      await this.connect()
      const response = await internalQuery(this.client, getSqlQuery(query))
      return response.recordset || [{ deleted: true }]
    }

    async query(json: QueryJson) {
      const operation = this._operation(json).toLowerCase()
      const input = this._query(json)
      const response = await internalQuery(this.client, input)
      return response.recordset ? response.recordset : [{ [operation]: true }]
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: SqlServerIntegration,
  }
}

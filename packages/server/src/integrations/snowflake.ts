import { Integration, QueryTypes, SqlQuery } from "../definitions/datasource"
const snowflake = require("snowflake-sdk")

module SnowflakeModule {
  interface SnowflakeConfig {
    account: string
    username: string
    password: string
    warehouse: string
    database: string
    schema: string
  }

  const SCHEMA: Integration = {
    docs: "https://developers.snowflake.com/",
    description:
      "Snowflake is a solution for data warehousing, data lakes, data engineering, data science, data application development, and securely sharing and consuming shared data.",
    friendlyName: "Snowflake",
    datasource: {
      account: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
      password: {
        type: "password",
        required: true,
      },
      warehouse: {
        type: "string",
        required: true,
      },
      database: {
        type: "string",
        required: true,
      },
      schema: {
        type: "string",
        required: true,
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

  class SnowflakeIntegration {
    private config: SnowflakeConfig
    private client: any

    constructor(config: SnowflakeConfig) {
      this.config = config
      this.client = snowflake.createConnection(config)
    }

    async connAsync(connection: any) {
      return new Promise((resolve, reject) => {
        connection.connect(function (err: any, conn: any) {
          if (err) reject(err)
          resolve(conn)
        })
      })
    }

    async read(query: SqlQuery) {
      let connection: any = await this.connAsync(this.client)
      let response: any = await new Promise((resolve, reject) =>
        connection.execute({
          sqlText: query.sql,
          streamResult: false,
          complete: (err: any, statement: any, rows: any) => {
            resolve({ rows })
          },
        })
      )
      return response.rows
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: SnowflakeIntegration,
  }
}

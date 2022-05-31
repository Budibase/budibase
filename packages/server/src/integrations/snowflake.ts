import { Integration, QueryTypes, SqlQuery } from "../definitions/datasource"
import {
  SnowflakeError,
  Statement,
  createConnection,
  Connection,
} from "snowflake-sdk"

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
    private client: Connection

    constructor(config: SnowflakeConfig) {
      this.client = createConnection(config)
    }

    async connectAsync() {
      return new Promise((resolve, reject) => {
        this.client.connect(function (err: any, conn: any) {
          if (err) reject(err)
          resolve(conn)
        })
      })
    }

    async read(query: SqlQuery) {
      await this.connectAsync()
      let response: any = await new Promise((resolve, reject) =>
        this.client.execute({
          sqlText: query.sql,
          streamResult: false,
          complete: (
            err: SnowflakeError | undefined,
            stmt: Statement,
            rows: any[] | undefined
          ) => {
            if (err) reject(err?.message.split(":")[1] || err?.message)
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

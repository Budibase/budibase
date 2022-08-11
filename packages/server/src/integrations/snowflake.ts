import { Integration, QueryType, SqlQuery } from "@budibase/types"
import { Snowflake } from "snowflake-promise"

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
    type: "Relational",
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

  class SnowflakeIntegration {
    private client: Snowflake

    constructor(config: SnowflakeConfig) {
      this.client = new Snowflake(config)
    }

    async internalQuery(query: SqlQuery) {
      await this.client.connect()
      try {
        return await this.client.execute(query.sql)
      } catch (err: any) {
        throw err?.message.split(":")[1] || err?.message
      }
    }

    async create(query: SqlQuery) {
      return this.internalQuery(query)
    }

    async read(query: SqlQuery) {
      return this.internalQuery(query)
    }

    async update(query: SqlQuery) {
      return this.internalQuery(query)
    }

    async delete(query: SqlQuery) {
      return this.internalQuery(query)
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: SnowflakeIntegration,
  }
}

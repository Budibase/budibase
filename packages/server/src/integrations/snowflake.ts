import {
  ConnectionInfo,
  DatasourceFeature,
  DatasourceFieldType,
  Integration,
  QueryType,
  SqlQuery,
} from "@budibase/types"
import { Snowflake } from "snowflake-promise"

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
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    account: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    username: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      required: true,
    },
    role: {
      type: DatasourceFieldType.STRING,
    },
    warehouse: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    database: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    schema: {
      type: DatasourceFieldType.STRING,
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

  async testConnection(): Promise<ConnectionInfo> {
    try {
      await this.client.connect()
      return { connected: true }
    } catch (e: any) {
      return {
        connected: false,
        error: e.message as string,
      }
    }
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

export default {
  schema: SCHEMA,
  integration: SnowflakeIntegration,
}

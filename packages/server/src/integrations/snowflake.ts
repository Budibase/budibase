import {
  ConnectionInfo,
  DatasourceFeature,
  DatasourceFieldType,
  Integration,
  QueryType,
  SqlQuery,
} from "@budibase/types"
import snowflakeSdk, { SnowflakeError } from "snowflake-sdk"
import { promisify } from "util"

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

class SnowflakePromise {
  config: SnowflakeConfig
  client?: snowflakeSdk.Connection

  constructor(config: SnowflakeConfig) {
    this.config = config
  }

  async connect() {
    if (this.client?.isUp()) return

    this.client = snowflakeSdk.createConnection(this.config)
    const connectAsync = promisify(this.client.connect.bind(this.client))
    return connectAsync()
  }

  async execute(sql: string) {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        throw Error(
          "No snowflake client present to execute query. Run connect() first to initialise."
        )
      }

      this.client.execute({
        sqlText: sql,
        complete: function (
          err: SnowflakeError | undefined,
          statementExecuted: any,
          rows: any
        ) {
          if (err) {
            return reject(err)
          }
          resolve(rows)
        },
      })
    })
  }
}

class SnowflakeIntegration {
  private client: SnowflakePromise

  constructor(config: SnowflakeConfig) {
    this.client = new SnowflakePromise(config)
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

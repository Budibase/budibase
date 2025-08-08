import {
  ConnectionInfo,
  DatasourceFeature,
  DatasourceFieldType,
  Integration,
  QueryType,
  SqlQuery,
} from "@budibase/types"
import { Client } from "pg"

interface RedshiftConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl?: boolean
  schema?: string
}

const SCHEMA: Integration = {
  docs: "https://docs.aws.amazon.com/redshift/",
  description:
    "Amazon Redshift is a fully managed, petabyte-scale data warehouse service in the cloud that makes it simple and cost-effective to analyze your data.",
  friendlyName: "Redshift",
  type: "Relational",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    host: {
      type: DatasourceFieldType.STRING,
      required: true,
      display: "Host",
    },
    port: {
      type: DatasourceFieldType.NUMBER,
      required: true,
      default: 5439,
      display: "Port",
    },
    database: {
      type: DatasourceFieldType.STRING,
      required: true,
      display: "Database",
    },
    user: {
      type: DatasourceFieldType.STRING,
      required: true,
      display: "User",
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      required: true,
      display: "Password",
    },
    schema: {
      type: DatasourceFieldType.STRING,
      display: "Schema",
      default: "public",
    },
    ssl: {
      type: DatasourceFieldType.BOOLEAN,
      display: "Use SSL",
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

class RedshiftIntegration {
  private config: RedshiftConfig
  private client?: Client

  constructor(config: RedshiftConfig) {
    this.config = config
  }

  async connect() {
    if (this.client) {
      return
    }

    this.client = new Client({
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.user,
      password: this.config.password,
      ssl: this.config.ssl,
    })

    await this.client.connect()
  }

  async disconnect() {
    if (this.client) {
      await this.client.end()
      this.client = undefined
    }
  }

  async testConnection(): Promise<ConnectionInfo> {
    try {
      await this.connect()
      await this.client!.query("SELECT 1")
      return { connected: true }
    } catch (e: any) {
      return {
        connected: false,
        error: e.message as string,
      }
    } finally {
      await this.disconnect()
    }
  }

  async internalQuery(query: SqlQuery) {
    await this.connect()
    try {
      const result = await this.client!.query(query.sql)
      return result.rows
    } catch (err: any) {
      throw err?.message || err
    } finally {
      await this.disconnect()
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
  integration: RedshiftIntegration,
}

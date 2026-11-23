import {
  ConnectionInfo,
  DatasourceFeature,
  DatasourceFieldType,
  Integration,
  QueryType,
  SqlQuery,
  type SqlDatasource,
} from "@budibase/types"
import { utils } from "@budibase/backend-core"
import snowflakeSdk, {
  type ConnectionOptions,
  SnowflakeError,
} from "snowflake-sdk"
import { promisify } from "util"

interface SnowflakeConfig {
  account: string
  username: string
  /** @deprecated Use privateKey instead */
  password: string | undefined
  privateKey: string
  authenticator: string
  role?: string
  warehouse: string
  database: string
  schema: string
}

const SCHEMA: Integration = {
  docs: "https://developers.snowflake.com/",
  description:
    "Snowflake is a solution for data warehousing, data lakes, data engineering, data science, data application development, and securely sharing and consuming shared data.",
  friendlyName: "Snowflake",
  warningMessage:
    "Snowflake has announced upcoming security policy changes that will disallow passwords for all non-human service by October 2026. In order to avoid any disruption, please consider using key pair authentication.",
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
      required: false,
      deprecated: true,
    },
    privateKey: {
      display: "Private Key (PEM)",
      type: DatasourceFieldType.SENSITIVE_LONGFORM,
      required: false,
    },
    authenticator: {
      type: DatasourceFieldType.STRING,
      required: false,
      hidden: "true",
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

    const privateKey = this.config.privateKey?.trim()

    // Only known keys are passed on: the SDK also accepts keys such as
    // accessUrl, host and proxyHost, which would point it at an arbitrary host.
    const options: ConnectionOptions = {
      account: this.config.account,
      username: this.config.username,
      password: this.config.password,
      role: this.config.role,
      warehouse: this.config.warehouse,
      database: this.config.database,
      schema: this.config.schema,
      authenticator: privateKey ? "SNOWFLAKE_JWT" : "SNOWFLAKE",
      ...(privateKey && { privateKey }),
    }

    // createConnection validates the account and fills in `options.host` with
    // the host it will connect to, without any network request. The SDK has no
    // hook for a checked lookup, so that host is checked before each
    // connection. Without a host there is nothing to check, so don't connect.
    const client = snowflakeSdk.createConnection(options)
    if (!options.host) {
      throw new Error("Snowflake host could not be determined.")
    }
    await utils.resolveSafeHostIp(options.host)

    this.client = client
    const connectAsync = promisify(client.connect.bind(client))
    return connectAsync()
  }

  async execute(sql: string, bindings?: any[]) {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        throw Error(
          "No snowflake client present to execute query. Run connect() first to initialise."
        )
      }

      this.client.execute({
        sqlText: sql,
        binds: bindings,
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

class SnowflakeIntegration implements SqlDatasource {
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

  getBindingIdentifier(): string {
    return "?"
  }

  getStringConcat(parts: string[]): string {
    return `concat(${parts.join(", ")})`
  }

  async internalQuery(query: SqlQuery) {
    await this.client.connect()
    try {
      return await this.client.execute(query.sql, query.bindings)
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

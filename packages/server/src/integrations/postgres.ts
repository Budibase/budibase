import fs from "fs"
import {
  Integration,
  DatasourceFieldType,
  QueryType,
  QueryJson,
  SqlQuery,
  ExternalTable,
  DatasourcePlus,
  DatasourceFeature,
  ConnectionInfo,
  SourceName,
} from "@budibase/types"
import {
  getSqlQuery,
  buildExternalTableId,
  convertSqlType,
  finaliseExternalTables,
  SqlClient,
} from "./utils"
import Sql from "./base/sql"
import { PostgresColumn } from "./base/types"
import { escapeDangerousCharacters } from "../utilities"

import { Client, ClientConfig, types } from "pg"
import { getReadableErrorMessage } from "./base/errorMapping"
import { exec } from "child_process"
import { storeTempFile } from "../utilities/fileSystem"

// Return "date" and "timestamp" types as plain strings.
// This lets us reference the original stored timezone.
// types is undefined when running in a test env for some reason.
if (types) {
  types.setTypeParser(1114, (val: any) => val) // timestamp
  types.setTypeParser(1082, (val: any) => val) // date
  types.setTypeParser(1184, (val: any) => val) // timestampz
}

const JSON_REGEX = /'{.*}'::json/s

interface PostgresConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  schema: string
  ssl?: boolean
  ca?: string
  clientKey?: string
  clientCert?: string
  rejectUnauthorized?: boolean
}

const SCHEMA: Integration = {
  docs: "https://node-postgres.com",
  plus: true,
  friendlyName: "PostgreSQL",
  type: "Relational",
  description:
    "PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
    [DatasourceFeature.FETCH_TABLE_NAMES]: true,
    [DatasourceFeature.EXPORT_SCHEMA]: true,
  },
  datasource: {
    host: {
      type: DatasourceFieldType.STRING,
      default: "localhost",
      required: true,
    },
    port: {
      type: DatasourceFieldType.NUMBER,
      required: true,
      default: 5432,
    },
    database: {
      type: DatasourceFieldType.STRING,
      default: "postgres",
      required: true,
    },
    user: {
      type: DatasourceFieldType.STRING,
      default: "root",
      required: true,
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      default: "root",
      required: true,
    },
    schema: {
      type: DatasourceFieldType.STRING,
      default: "public",
      required: true,
    },
    ssl: {
      type: DatasourceFieldType.BOOLEAN,
      default: false,
      required: false,
    },
    rejectUnauthorized: {
      type: DatasourceFieldType.BOOLEAN,
      default: false,
      required: false,
    },
    ca: {
      display: "Server CA",
      type: DatasourceFieldType.LONGFORM,
      default: false,
      required: false,
    },
    clientKey: {
      display: "Client key",
      type: DatasourceFieldType.LONGFORM,
      default: false,
      required: false,
    },
    clientCert: {
      display: "Client cert",
      type: DatasourceFieldType.LONGFORM,
      default: false,
      required: false,
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

class PostgresIntegration extends Sql implements DatasourcePlus {
  private readonly client: Client
  private readonly config: PostgresConfig
  private index: number = 1
  private open: boolean
  public tables: Record<string, ExternalTable> = {}
  public schemaErrors: Record<string, string> = {}

  COLUMNS_SQL!: string

  PRIMARY_KEYS_SQL = () => `
  SELECT pg_namespace.nspname table_schema
     , pg_class.relname table_name
     , pg_attribute.attname primary_key
  FROM pg_class
  JOIN pg_index ON pg_class.oid = pg_index.indrelid AND pg_index.indisprimary
  JOIN pg_attribute ON pg_attribute.attrelid = pg_class.oid AND pg_attribute.attnum = ANY(pg_index.indkey)
  JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
  WHERE pg_namespace.nspname = '${this.config.schema}';
  `

  constructor(config: PostgresConfig) {
    super(SqlClient.POSTGRES)
    this.config = config

    let newConfig: ClientConfig = {
      ...this.config,
      ssl: this.config.ssl
        ? {
            rejectUnauthorized: this.config.rejectUnauthorized,
            ca: this.config.ca,
            key: this.config.clientKey,
            cert: this.config.clientCert,
          }
        : undefined,
    }
    this.client = new Client(newConfig)
    this.open = false
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }

    try {
      await this.openConnection()
      response.connected = true
    } catch (e: any) {
      console.log(e)
      response.error = e.message as string
    } finally {
      await this.closeConnection()
    }
    return response
  }

  getBindingIdentifier(): string {
    return `$${this.index++}`
  }

  getStringConcat(parts: string[]): string {
    return parts.join(" || ")
  }

  async openConnection() {
    await this.client.connect()
    if (!this.config.schema) {
      this.config.schema = "public"
    }
    await this.client.query(`SET search_path TO "${this.config.schema}"`)
    this.COLUMNS_SQL = `select * from information_schema.columns where table_schema = '${this.config.schema}'`
    this.open = true
  }

  closeConnection() {
    const pg = this
    return new Promise<void>((resolve, reject) => {
      this.client.end((err: any) => {
        pg.open = false
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async internalQuery(query: SqlQuery, close: boolean = true) {
    if (!this.open) {
      await this.openConnection()
    }
    const client = this.client
    this.index = 1
    // need to handle a specific issue with json data types in postgres,
    // new lines inside the JSON data will break it
    if (query && query.sql) {
      const matches = query.sql.match(JSON_REGEX)
      if (matches && matches.length > 0) {
        for (let match of matches) {
          const escaped = escapeDangerousCharacters(match)
          query.sql = query.sql.replace(match, escaped)
        }
      }
    }
    try {
      return await client.query(query.sql, query.bindings || [])
    } catch (err: any) {
      await this.closeConnection()
      let readableMessage = getReadableErrorMessage(
        SourceName.POSTGRES,
        err.code
      )
      if (readableMessage) {
        throw new Error(readableMessage)
      } else {
        throw new Error(err.message as string)
      }
    } finally {
      if (close) {
        await this.closeConnection()
      }
    }
  }

  /**
   * Fetches the tables from the postgres table and assigns them to the datasource.
   * @param {*} datasourceId - datasourceId to fetch
   * @param entities - the tables that are to be built
   */
  async buildSchema(
    datasourceId: string,
    entities: Record<string, ExternalTable>
  ) {
    let tableKeys: { [key: string]: string[] } = {}
    await this.openConnection()
    try {
      const primaryKeysResponse = await this.client.query(
        this.PRIMARY_KEYS_SQL()
      )
      for (let table of primaryKeysResponse.rows) {
        const tableName = table.table_name
        if (!tableKeys[tableName]) {
          tableKeys[tableName] = []
        }
        const key = table.column_name || table.primary_key
        // only add the unique keys
        if (key && tableKeys[tableName].indexOf(key) === -1) {
          tableKeys[tableName].push(key)
        }
      }
    } catch (err) {
      tableKeys = {}
    }

    try {
      const columnsResponse: { rows: PostgresColumn[] } =
        await this.client.query(this.COLUMNS_SQL)

      const tables: { [key: string]: ExternalTable } = {}

      for (let column of columnsResponse.rows) {
        const tableName: string = column.table_name
        const columnName: string = column.column_name

        // table key doesn't exist yet
        if (!tables[tableName] || !tables[tableName].schema) {
          tables[tableName] = {
            _id: buildExternalTableId(datasourceId, tableName),
            primary: tableKeys[tableName] || [],
            name: tableName,
            schema: {},
            sourceId: datasourceId,
          }
        }

        const identity = !!(
          column.identity_generation ||
          column.identity_start ||
          column.identity_increment
        )
        const hasDefault = column.column_default != null
        const hasNextVal =
          typeof column.column_default === "string" &&
          column.column_default.startsWith("nextval")
        const isGenerated =
          column.is_generated && column.is_generated !== "NEVER"
        const isAuto: boolean = hasNextVal || identity || isGenerated
        const required = column.is_nullable === "NO"
        const constraints = {
          presence: required && !hasDefault && !isGenerated,
        }
        tables[tableName].schema[columnName] = {
          autocolumn: isAuto,
          name: columnName,
          constraints,
          ...convertSqlType(column.data_type),
          externalType: column.data_type,
        }
      }

      const final = finaliseExternalTables(tables, entities)
      this.tables = final.tables
      this.schemaErrors = final.errors
    } catch (err) {
      // @ts-ignore
      throw new Error(err)
    } finally {
      await this.closeConnection()
    }
  }

  async getTableNames() {
    try {
      await this.openConnection()
      const columnsResponse: { rows: PostgresColumn[] } =
        await this.client.query(this.COLUMNS_SQL)
      const names = columnsResponse.rows.map(row => row.table_name)
      return [...new Set(names)]
    } finally {
      await this.closeConnection()
    }
  }

  async create(query: SqlQuery | string) {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows.length ? response.rows : [{ created: true }]
  }

  async read(query: SqlQuery | string) {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows
  }

  async update(query: SqlQuery | string) {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows.length ? response.rows : [{ updated: true }]
  }

  async delete(query: SqlQuery | string) {
    const response = await this.internalQuery(getSqlQuery(query))
    return response.rows.length ? response.rows : [{ deleted: true }]
  }

  async query(json: QueryJson) {
    const operation = this._operation(json).toLowerCase()
    const input = this._query(json)
    if (Array.isArray(input)) {
      const responses = []
      for (let query of input) {
        responses.push(await this.internalQuery(query, false))
      }
      await this.closeConnection()
      return responses
    } else {
      const response = await this.internalQuery(input)
      return response.rows.length ? response.rows : [{ [operation]: true }]
    }
  }

  async getExternalSchema() {
    const dumpCommandParts = [
      `user=${this.config.user}`,
      `host=${this.config.host}`,
      `port=${this.config.port}`,
      `dbname=${this.config.database}`,
    ]

    if (this.config.ssl) {
      dumpCommandParts.push("sslmode=verify-ca")
      if (this.config.ca) {
        const caFilePath = storeTempFile(this.config.ca)
        fs.chmodSync(caFilePath, "0600")
        dumpCommandParts.push(`sslrootcert=${caFilePath}`)
      }

      if (this.config.clientCert) {
        const clientCertFilePath = storeTempFile(this.config.clientCert)
        fs.chmodSync(clientCertFilePath, "0600")
        dumpCommandParts.push(`sslcert=${clientCertFilePath}`)
      }

      if (this.config.clientKey) {
        const clientKeyFilePath = storeTempFile(this.config.clientKey)
        fs.chmodSync(clientKeyFilePath, "0600")
        dumpCommandParts.push(`sslkey=${clientKeyFilePath}`)
      }
    }

    const dumpCommand = `PGPASSWORD="${
      this.config.password
    }" pg_dump --schema-only "${dumpCommandParts.join(" ")}"`

    return new Promise<string>((res, rej) => {
      exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error generating dump: ${error.message}`)
          rej(error.message)
          return
        }

        if (stderr) {
          console.error(`pg_dump error: ${stderr}`)
          rej(stderr)
          return
        }

        res(stdout)
        console.log("SQL dump generated successfully!")
      })
    })
  }
}

export default {
  schema: SCHEMA,
  integration: PostgresIntegration,
}

import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
  QueryJson,
  SqlQuery,
} from "../definitions/datasource"
import { Table } from "../definitions/common"
import {
  getSqlQuery,
  buildExternalTableId,
  convertSqlType,
  finaliseExternalTables,
  SqlClients,
} from "./utils"
import { DatasourcePlus } from "./base/datasourcePlus"

module PostgresModule {
  const { Client } = require("pg")
  const Sql = require("./base/sql")
  const { escapeDangerousCharacters } = require("../utilities")

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
    rejectUnauthorized?: boolean
  }

  const SCHEMA: Integration = {
    docs: "https://node-postgres.com",
    plus: true,
    friendlyName: "PostgreSQL",
    description:
      "PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.",
    datasource: {
      host: {
        type: DatasourceFieldTypes.STRING,
        default: "localhost",
        required: true,
      },
      port: {
        type: DatasourceFieldTypes.NUMBER,
        required: true,
        default: 5432,
      },
      database: {
        type: DatasourceFieldTypes.STRING,
        default: "postgres",
        required: true,
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
      schema: {
        type: DatasourceFieldTypes.STRING,
        default: "public",
        required: true,
      },
      ssl: {
        type: DatasourceFieldTypes.BOOLEAN,
        default: false,
        required: false,
      },
      rejectUnauthorized: {
        type: DatasourceFieldTypes.BOOLEAN,
        default: false,
        required: false,
      },
      ca: {
        type: DatasourceFieldTypes.LONGFORM,
        default: false,
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

  class PostgresIntegration extends Sql implements DatasourcePlus {
    private readonly client: any
    private readonly config: PostgresConfig
    private index: number = 1
    public tables: Record<string, Table> = {}
    public schemaErrors: Record<string, string> = {}

    COLUMNS_SQL!: string

    PRIMARY_KEYS_SQL = `
    select tc.table_schema, tc.table_name, kc.column_name as primary_key 
    from information_schema.table_constraints tc
    join 
      information_schema.key_column_usage kc on kc.table_name = tc.table_name 
      and kc.table_schema = tc.table_schema 
      and kc.constraint_name = tc.constraint_name
    where tc.constraint_type = 'PRIMARY KEY';
    `

    constructor(config: PostgresConfig) {
      super(SqlClients.POSTGRES)
      this.config = config

      let newConfig = {
        ...this.config,
        ssl: this.config.ssl
          ? {
              rejectUnauthorized: this.config.rejectUnauthorized,
              ca: this.config.ca,
            }
          : undefined,
      }
      this.client = new Client(newConfig)
      this.setSchema()
    }

    getBindingIdentifier(): string {
      return `$${this.index++}`
    }

    getStringConcat(parts: string[]): string {
      return parts.join(" || ")
    }

    async internalQuery(query: SqlQuery, close: boolean = true) {
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
      } catch (err) {
        await this.client.end()
        // @ts-ignore
        throw new Error(err)
      } finally {
        if (close) await this.client.end()
      }
    }

    async setSchema() {
      await this.client.connect()
      if (!this.config.schema) {
        this.config.schema = "public"
      }
      this.client.query(`SET search_path TO ${this.config.schema}`)
      this.COLUMNS_SQL = `select * from information_schema.columns where table_schema = '${this.config.schema}'`
    }

    /**
     * Fetches the tables from the postgres table and assigns them to the datasource.
     * @param {*} datasourceId - datasourceId to fetch
     * @param entities - the tables that are to be built
     */
    async buildSchema(datasourceId: string, entities: Record<string, Table>) {
      let tableKeys: { [key: string]: string[] } = {}
      try {
        const primaryKeysResponse = await this.client.query(
          this.PRIMARY_KEYS_SQL
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
        const columnsResponse = await this.client.query(this.COLUMNS_SQL)

        const tables: { [key: string]: Table } = {}

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
            }
          }

          const identity = !!(
            column.identity_generation ||
            column.identity_start ||
            column.identity_increment
          )
          const hasDefault =
            typeof column.column_default === "string" &&
            column.column_default.startsWith("nextval")
          const isGenerated =
            column.is_generated && column.is_generated !== "NEVER"
          const isAuto: boolean = hasDefault || identity || isGenerated
          tables[tableName].schema[columnName] = {
            autocolumn: isAuto,
            name: columnName,
            ...convertSqlType(column.data_type),
          }
        }

        const final = finaliseExternalTables(tables, entities)
        this.tables = final.tables
        this.schemaErrors = final.errors
      } catch (err) {
        // @ts-ignore
        throw new Error(err)
      } finally {
        await this.client.end()
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
        await this.client.end()
        return responses
      } else {
        const response = await this.internalQuery(input)
        return response.rows.length ? response.rows : [{ [operation]: true }]
      }
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: PostgresIntegration,
  }
}

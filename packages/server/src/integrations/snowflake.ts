import {
  Integration,
  QueryTypes,
  SqlQuery,
  DatasourceFieldTypes,
} from "../definitions/datasource"
import {
  SnowflakeError,
  Statement,
  createConnection,
  Connection,
} from "snowflake-sdk"
import {
  SqlClients,
  finaliseExternalTables,
  buildExternalTableId,
  convertSqlType,
} from "./utils"
import { DatasourcePlus } from "./base/datasourcePlus"
import { Table, TableSchema } from "../definitions/common"

module SnowflakeModule {
  const Sql = require("./base/sql")

  interface SnowflakeConfig {
    account: string
    username: string
    password: string
    warehouse: string
    database: string
    schema: string
  }

  const SCHEMA: Integration = {
    plus: true,
    docs: "https://developers.snowflake.com/",
    description:
      "Snowflake is a solution for data warehousing, data lakes, data engineering, data science, data application development, and securely sharing and consuming shared data.",
    friendlyName: "Snowflake",
    datasource: {
      account: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      username: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      password: {
        type: DatasourceFieldTypes.PASSWORD,
        required: true,
      },
      warehouse: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      database: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      schema: {
        type: DatasourceFieldTypes.STRING,
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

  class SnowflakeIntegration extends Sql implements DatasourcePlus {
    private client: Connection
    private config: SnowflakeConfig
    public tables: Record<string, Table> = {}
    public schemaErrors: Record<string, string> = {}

    constructor(config: SnowflakeConfig) {
      super(SqlClients.SNOWFLAKE)
      this.config = config
      this.client = createConnection(config)
    }

    getBindingIdentifier(): string {
      return "?"
    }

    getStringConcat(parts: string[]): string {
      return `concat(${parts.join(", ")})`
    }

    async buildSchema(datasourceId: string, entities: Record<string, Table>) {
      const tables: { [key: string]: Table } = {}
      const database = this.config.database

      // get the tables first
      const tablesResp = await this.internalQuery({ sql: "SHOW TABLES;" })
      const tableNames = tablesResp.map((obj: any) => obj.name)
      for (let tableName of tableNames) {
        const primaryKeys = []
        const schema: TableSchema = {}
        const descResp = await this.internalQuery({
          sql: `DESCRIBE TABLE ${tableName};`,
        })
        if (tableName === "CUSTOMER") {
          console.log("DESC = ", descResp)
        }
        for (let column of descResp) {
          const columnName = column.Field
          if (
            column["primary key"] === "Y" &&
            primaryKeys.indexOf(column.Key) === -1
          ) {
            primaryKeys.push(columnName)
          }
          const constraints = {
            presence: column["null?"] !== "Y",
          }
          const isAuto: boolean = column.default
            ?.toLowerCase()
            .includes("increment")
          schema[columnName] = {
            name: columnName,
            autocolumn: isAuto,
            constraints,
            ...convertSqlType(column["type"]),
          }
        }
        if (!tables[tableName]) {
          tables[tableName] = {
            _id: buildExternalTableId(datasourceId, tableName),
            primary: primaryKeys,
            name: tableName,
            schema,
          }
        }
      }
      const final = finaliseExternalTables(tables, entities)
      this.tables = final.tables
      this.schemaErrors = final.errors
    }

    async connectAsync() {
      return new Promise((resolve, reject) => {
        this.client.connect(function (err: any, conn: any) {
          if (err) reject(err)
          resolve(conn)
        })
      })
    }

    async internalQuery(query: SqlQuery) {
      if (!this.client.isUp()) {
        await this.connectAsync()
      }
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

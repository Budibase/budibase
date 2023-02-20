import {
  Integration,
  DatasourceFieldType,
  QueryType,
  QueryJson,
  SqlQuery,
  Table,
  TableSchema,
  DatasourcePlus,
} from "@budibase/types"
import {
  getSqlQuery,
  SqlClient,
  buildExternalTableId,
  convertSqlType,
  finaliseExternalTables,
} from "./utils"
import dayjs from "dayjs"
import { NUMBER_REGEX } from "../utilities"
import Sql from "./base/sql"
import { MySQLColumn } from "./base/types"

const mysql = require("mysql2/promise")

interface MySQLConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  ssl?: { [key: string]: any }
  rejectUnauthorized: boolean
  typeCast: Function
  multipleStatements: boolean
}

const SCHEMA: Integration = {
  docs: "https://github.com/sidorares/node-mysql2",
  plus: true,
  friendlyName: "MySQL",
  type: "Relational",
  description:
    "MySQL Database Service is a fully managed database service to deploy cloud-native applications. ",
  datasource: {
    host: {
      type: DatasourceFieldType.STRING,
      default: "localhost",
      required: true,
    },
    port: {
      type: DatasourceFieldType.NUMBER,
      default: 3306,
      required: false,
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
    database: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    ssl: {
      type: DatasourceFieldType.OBJECT,
      required: false,
    },
    rejectUnauthorized: {
      type: DatasourceFieldType.BOOLEAN,
      default: true,
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

const TimezoneAwareDateTypes = ["timestamp"]

function bindingTypeCoerce(bindings: any[]) {
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i]
    if (typeof binding !== "string") {
      continue
    }
    const matches = binding.match(NUMBER_REGEX)
    // check if number first
    if (matches && matches[0] !== "" && !isNaN(Number(matches[0]))) {
      bindings[i] = parseFloat(binding)
    }
    // if not a number, see if it is a date - important to do in this order as any
    // integer will be considered a valid date
    else if (
      /^\d/.test(binding) &&
      dayjs(binding).isValid() &&
      !binding.includes(",")
    ) {
      bindings[i] = dayjs(binding).toDate()
    }
  }
  return bindings
}

class MySQLIntegration extends Sql implements DatasourcePlus {
  private config: MySQLConfig
  private client: any
  public tables: Record<string, Table> = {}
  public schemaErrors: Record<string, string> = {}

  constructor(config: MySQLConfig) {
    super(SqlClient.MY_SQL)
    this.config = config
    if (config.ssl && Object.keys(config.ssl).length === 0) {
      delete config.ssl
    }
    // make sure this defaults to true
    if (
      config.rejectUnauthorized != null &&
      !config.rejectUnauthorized &&
      config.ssl
    ) {
      config.ssl.rejectUnauthorized = config.rejectUnauthorized
    }
    // @ts-ignore
    delete config.rejectUnauthorized
    this.config = {
      ...config,
      multipleStatements: true,
      typeCast: function (field: any, next: any) {
        if (
          field.type == "DATETIME" ||
          field.type === "DATE" ||
          field.type === "TIMESTAMP" ||
          field.type === "LONGLONG"
        ) {
          return field.string()
        }
        if (field.type === "BIT" && field.length === 1) {
          return field.buffer()?.[0]
        }
        return next()
      },
    }
  }

  getBindingIdentifier(): string {
    return "?"
  }

  getStringConcat(parts: string[]): string {
    return `concat(${parts.join(", ")})`
  }

  async connect() {
    this.client = await mysql.createConnection(this.config)
  }

  async disconnect() {
    await this.client.end()
  }

  async internalQuery(
    query: SqlQuery,
    opts: { connect?: boolean; disableCoercion?: boolean } = {
      connect: true,
      disableCoercion: false,
    }
  ): Promise<any[] | any> {
    try {
      if (opts?.connect) {
        await this.connect()
      }
      const baseBindings = query.bindings || []
      const bindings = opts?.disableCoercion
        ? baseBindings
        : bindingTypeCoerce(baseBindings)
      // Node MySQL is callback based, so we must wrap our call in a promise
      const response = await this.client.query(query.sql, bindings)
      return response[0]
    } finally {
      if (opts?.connect) {
        await this.disconnect()
      }
    }
  }

  async buildSchema(datasourceId: string, entities: Record<string, Table>) {
    const tables: { [key: string]: Table } = {}
    const database = this.config.database
    await this.connect()

    try {
      // get the tables first
      const tablesResp: Record<string, string>[] = await this.internalQuery(
        { sql: "SHOW TABLES;" },
        { connect: false }
      )
      const tableNames: string[] = tablesResp.map(
        (obj: any) =>
          obj[`Tables_in_${database}`] ||
          obj[`Tables_in_${database.toLowerCase()}`]
      )
      for (let tableName of tableNames) {
        const primaryKeys = []
        const schema: TableSchema = {}
        const descResp: MySQLColumn[] = await this.internalQuery(
          { sql: `DESCRIBE \`${tableName}\`;` },
          { connect: false }
        )
        for (let column of descResp) {
          const columnName = column.Field
          if (column.Key === "PRI" && primaryKeys.indexOf(column.Key) === -1) {
            primaryKeys.push(columnName)
          }
          const constraints = {
            presence: column.Null !== "YES",
          }
          const isAuto: boolean =
            typeof column.Extra === "string" &&
            (column.Extra === "auto_increment" ||
              column.Extra.toLowerCase().includes("generated"))
          schema[columnName] = {
            name: columnName,
            autocolumn: isAuto,
            constraints,
            ...convertSqlType(column.Type),
            externalType: column.Type,
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
    } finally {
      await this.disconnect()
    }
    const final = finaliseExternalTables(tables, entities)
    this.tables = final.tables
    this.schemaErrors = final.errors
  }

  async create(query: SqlQuery | string) {
    const results = await this.internalQuery(getSqlQuery(query))
    return results.length ? results : [{ created: true }]
  }

  async read(query: SqlQuery | string) {
    return this.internalQuery(getSqlQuery(query))
  }

  async update(query: SqlQuery | string) {
    const results = await this.internalQuery(getSqlQuery(query))
    return results.length ? results : [{ updated: true }]
  }

  async delete(query: SqlQuery | string) {
    const results = await this.internalQuery(getSqlQuery(query))
    return results.length ? results : [{ deleted: true }]
  }

  async query(json: QueryJson) {
    await this.connect()
    try {
      const queryFn = (query: any) =>
        this.internalQuery(query, { connect: false, disableCoercion: true })
      return await this.queryWithReturning(json, queryFn)
    } finally {
      await this.disconnect()
    }
  }
}

export default {
  schema: SCHEMA,
  integration: MySQLIntegration,
}

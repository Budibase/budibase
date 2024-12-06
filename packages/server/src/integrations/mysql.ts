import {
  Integration,
  DatasourceFieldType,
  QueryType,
  SqlQuery,
  Table,
  TableSchema,
  DatasourcePlus,
  DatasourceFeature,
  ConnectionInfo,
  SourceName,
  Schema,
  TableSourceType,
  DatasourcePlusQueryResponse,
  SqlQueryBinding,
  SqlClient,
  EnrichedQueryJson,
} from "@budibase/types"
import {
  getSqlQuery,
  buildExternalTableId,
  generateColumnDefinition,
  finaliseExternalTables,
  checkExternalTables,
  HOST_ADDRESS,
} from "./utils"
import { isDate, NUMBER_REGEX } from "../utilities"
import { MySQLColumn } from "./base/types"
import { getReadableErrorMessage } from "./base/errorMapping"
import { sql } from "@budibase/backend-core"
import mysql from "mysql2/promise"

const Sql = sql.Sql

interface MySQLConfig extends mysql.ConnectionOptions {
  database: string
  rejectUnauthorized: boolean
}

const SCHEMA: Integration = {
  docs: "https://github.com/sidorares/node-mysql2",
  plus: true,
  friendlyName: "MySQL",
  type: "Relational",
  description:
    "MySQL Database Service is a fully managed database service to deploy cloud-native applications. ",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
    [DatasourceFeature.FETCH_TABLE_NAMES]: true,
    [DatasourceFeature.EXPORT_SCHEMA]: true,
  },
  datasource: {
    host: {
      type: DatasourceFieldType.STRING,
      default: HOST_ADDRESS,
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

const defaultTypeCasting = function (field: any, next: any) {
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
}

export function bindingTypeCoerce(bindings: SqlQueryBinding) {
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
    else if (isDate(binding)) {
      let value: any
      value = new Date(binding)
      if (isNaN(value)) {
        value = binding
      }
      bindings[i] = value
    }
  }
  return bindings
}

class MySQLIntegration extends Sql implements DatasourcePlus {
  private readonly config: MySQLConfig
  private client?: mysql.Connection

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
      config.ssl &&
      typeof config.ssl !== "string"
    ) {
      config.ssl.rejectUnauthorized = config.rejectUnauthorized
    }
    // The MySQL library we use doesn't directly document the parameters that can be passed in the ssl
    // object, it instead points to an older library that it says it is mostly API compatible with, that
    // older library actually documents what parameters can be passed in the ssl object.
    // https://github.com/sidorares/node-mysql2#api-and-configuration
    // https://github.com/mysqljs/mysql#ssl-options

    // @ts-ignore
    delete config.rejectUnauthorized
    this.config = {
      ...config,
      typeCast: defaultTypeCasting,
      multipleStatements: true,
    }
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    try {
      const [result] = await this.internalQuery(
        { sql: "SELECT 1+1 AS checkRes" },
        { connect: true }
      )
      response.connected = result?.checkRes == 2
    } catch (e: any) {
      let readableMessage = getReadableErrorMessage(SourceName.MYSQL, e.errno)
      if (readableMessage) {
        response.error = readableMessage
      } else {
        response.error = e.message as string
      }
    }
    return response
  }

  getBindingIdentifier(): string {
    return "?"
  }

  getStringConcat(parts: string[]): string {
    return `concat(${parts.join(", ")})`
  }

  defineTypeCastingFromSchema(schema: {
    [key: string]: { name: string; type: string }
  }): void {
    if (!schema) {
      return
    }
    this.config.typeCast = function (field: any, next: any) {
      if (schema[field.name]?.name === field.name) {
        if (["LONGLONG", "NEWDECIMAL", "DECIMAL"].includes(field.type)) {
          if (schema[field.name]?.type === "number") {
            const value = field.string()
            return value ? Number(value) : null
          } else {
            return field.string()
          }
        }
      }
      if (
        field.type == "DATETIME" ||
        field.type === "DATE" ||
        field.type === "TIMESTAMP"
      ) {
        return field.string()
      }
      if (field.type === "BIT" && field.length === 1) {
        return field.buffer()?.[0]
      }
      return next()
    }
  }

  async connect() {
    this.client = await mysql.createConnection(this.config)
    const res = await this.internalQuery(
      {
        sql: "SELECT VERSION();",
      },
      { connect: false }
    )
    const version = res?.[0]?.["VERSION()"]
    if (version?.toLowerCase().includes("mariadb")) {
      this.setExtendedSqlClient(SqlClient.MARIADB)
    }
  }

  async disconnect() {
    await this.client!.end()
  }

  async internalQuery(
    query: SqlQuery,
    opts: {
      connect?: boolean
      disableCoercion?: boolean
    } = {
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
      this.log(query.sql, bindings)
      // Node MySQL is callback based, so we must wrap our call in a promise
      const response = await this.client!.query(query.sql, bindings)
      return response[0]
    } catch (err: any) {
      let readableMessage = getReadableErrorMessage(SourceName.MYSQL, err.errno)
      if (readableMessage) {
        throw new Error(readableMessage, { cause: err })
      } else {
        throw err
      }
    } finally {
      if (opts?.connect && this.client) {
        await this.disconnect()
      }
    }
  }

  async buildSchema(
    datasourceId: string,
    entities: Record<string, Table>
  ): Promise<Schema> {
    const tables: { [key: string]: Table } = {}
    await this.connect()

    try {
      // get the tables first
      const tableNames = await this.queryTableNames()
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
          const hasDefault = column.Default != null
          const isAuto: boolean =
            typeof column.Extra === "string" &&
            (column.Extra === "auto_increment" ||
              column.Extra.toLowerCase().includes("generated"))
          const required = column.Null !== "YES"
          schema[columnName] = generateColumnDefinition({
            name: columnName,
            autocolumn: isAuto,
            presence: required && !isAuto && !hasDefault,
            externalType: column.Type,
            options: column.Type.startsWith("enum")
              ? column.Type.substring(6, column.Type.length - 2).split("','")
              : undefined,
          })
        }
        if (!tables[tableName]) {
          tables[tableName] = {
            type: "table",
            _id: buildExternalTableId(datasourceId, tableName),
            sourceId: datasourceId,
            sourceType: TableSourceType.EXTERNAL,
            primary: primaryKeys,
            name: tableName,
            schema,
          }
        }
      }
    } finally {
      await this.disconnect()
    }

    let externalTables = finaliseExternalTables(tables, entities)
    let errors = checkExternalTables(tables)
    return { tables: externalTables, errors }
  }

  async queryTableNames() {
    const database = this.config.database
    const tablesResp: Record<string, string>[] = await this.internalQuery(
      { sql: "SHOW TABLES;" },
      { connect: false }
    )
    return tablesResp.map(
      (obj: any) =>
        obj[`Tables_in_${database}`] ||
        obj[`Tables_in_${database.toLowerCase()}`]
    )
  }

  async getTableNames() {
    await this.connect()
    try {
      return this.queryTableNames()
    } finally {
      await this.disconnect()
    }
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

  async query(json: EnrichedQueryJson): Promise<DatasourcePlusQueryResponse> {
    await this.connect()
    try {
      const queryFn = (query: any) =>
        this.internalQuery(query, { connect: false, disableCoercion: true })
      const processFn = (result: any) => {
        if (Array.isArray(result)) {
          return this.convertJsonStringColumns(
            json.table,
            result,
            json.tableAliases
          )
        }
        return result
      }
      return await this.queryWithReturning(json, queryFn, processFn)
    } finally {
      await this.disconnect()
    }
  }

  async getExternalSchema() {
    try {
      const [databaseResult] = await this.internalQuery({
        sql: `SHOW CREATE DATABASE IF NOT EXISTS \`${this.config.database}\``,
      })
      let dumpContent = [databaseResult["Create Database"]]

      const tablesResult = await this.internalQuery({
        sql: `SHOW TABLES`,
      })

      for (const row of tablesResult) {
        const tableName = row[`Tables_in_${this.config.database}`]

        const createTableResults = await this.internalQuery({
          sql: `SHOW CREATE TABLE \`${tableName}\``,
        })

        const createTableStatement = createTableResults[0]["Create Table"]

        dumpContent.push(createTableStatement)
      }

      return dumpContent.join(";\n") + ";"
    } finally {
      this.disconnect()
    }
  }
}

export default {
  schema: SCHEMA,
  integration: MySQLIntegration,
}

import {
  SqlQuery,
  Table,
  Datasource,
  FieldType,
  TableSourceType,
  FieldSchema,
} from "@budibase/types"
import { context, objectStore } from "@budibase/backend-core"
import { v4 } from "uuid"
import { parseStringPromise as xmlParser } from "xml2js"
import { formatBytes } from "../../utilities"
import bl from "bl"
import env from "../../environment"
import { DocumentType, SEPARATOR } from "../../db/utils"
import { InvalidColumns, DEFAULT_BB_DATASOURCE_ID } from "../../constants"
import { helpers, utils } from "@budibase/shared-core"
import { Knex } from "knex"

const DOUBLE_SEPARATOR = `${SEPARATOR}${SEPARATOR}`
const ROW_ID_REGEX = /^\[.*]$/g
const ENCODED_SPACE = encodeURIComponent(" ")

type PrimitiveTypes =
  | FieldType.STRING
  | FieldType.NUMBER
  | FieldType.BOOLEAN
  | FieldType.DATETIME
  | FieldType.JSON
  | FieldType.BIGINT
  | FieldType.OPTIONS

function isPrimitiveType(type: FieldType): type is PrimitiveTypes {
  return [
    FieldType.STRING,
    FieldType.NUMBER,
    FieldType.BOOLEAN,
    FieldType.DATETIME,
    FieldType.JSON,
    FieldType.BIGINT,
    FieldType.OPTIONS,
  ].includes(type)
}

const SQL_NUMBER_TYPE_MAP: Record<string, PrimitiveTypes> = {
  integer: FieldType.NUMBER,
  int: FieldType.NUMBER,
  decimal: FieldType.NUMBER,
  smallint: FieldType.NUMBER,
  real: FieldType.NUMBER,
  float: FieldType.NUMBER,
  numeric: FieldType.NUMBER,
  mediumint: FieldType.NUMBER,
  dec: FieldType.NUMBER,
  double: FieldType.NUMBER,
  fixed: FieldType.NUMBER,
  "double precision": FieldType.NUMBER,
  number: FieldType.NUMBER,
  binary_float: FieldType.NUMBER,
  binary_double: FieldType.NUMBER,
  money: FieldType.NUMBER,
  smallmoney: FieldType.NUMBER,
}

const SQL_DATE_TYPE_MAP: Record<string, PrimitiveTypes> = {
  timestamp: FieldType.DATETIME,
  time: FieldType.DATETIME,
  datetime: FieldType.DATETIME,
  smalldatetime: FieldType.DATETIME,
  date: FieldType.DATETIME,
}

const SQL_DATE_ONLY_TYPES = ["date"]
const SQL_TIME_ONLY_TYPES = [
  "time",
  "time without time zone",
  "time with time zone",
]

const SQL_STRING_TYPE_MAP: Record<string, PrimitiveTypes> = {
  varchar: FieldType.STRING,
  char: FieldType.STRING,
  nchar: FieldType.STRING,
  nvarchar: FieldType.STRING,
  ntext: FieldType.STRING,
  enum: FieldType.STRING,
  blob: FieldType.STRING,
  long: FieldType.STRING,
  text: FieldType.STRING,
}

const SQL_BOOLEAN_TYPE_MAP: Record<string, PrimitiveTypes> = {
  boolean: FieldType.BOOLEAN,
  bit: FieldType.BOOLEAN,
  tinyint: FieldType.BOOLEAN,
}

const SQL_OPTIONS_TYPE_MAP: Record<string, PrimitiveTypes> = {
  "user-defined": FieldType.OPTIONS,
}

const SQL_MISC_TYPE_MAP: Record<string, PrimitiveTypes> = {
  json: FieldType.JSON,
  bigint: FieldType.BIGINT,
  enum: FieldType.OPTIONS,
}

const SQL_TYPE_MAP: Record<string, PrimitiveTypes> = {
  ...SQL_NUMBER_TYPE_MAP,
  ...SQL_DATE_TYPE_MAP,
  ...SQL_STRING_TYPE_MAP,
  ...SQL_BOOLEAN_TYPE_MAP,
  ...SQL_MISC_TYPE_MAP,
  ...SQL_OPTIONS_TYPE_MAP,
}

export enum SqlClient {
  MS_SQL = "mssql",
  POSTGRES = "pg",
  MY_SQL = "mysql2",
  ORACLE = "oracledb",
  SQL_LITE = "sqlite3",
}

const isCloud = env.isProd() && !env.SELF_HOSTED
const isSelfHost = env.isProd() && env.SELF_HOSTED
export const HOST_ADDRESS = isSelfHost
  ? "host.docker.internal"
  : isCloud
  ? ""
  : "localhost"

export function isExternalTableID(tableId: string) {
  return tableId.includes(DocumentType.DATASOURCE)
}

export function isInternalTableID(tableId: string) {
  return !isExternalTableID(tableId)
}

export function getNativeSql(
  query: Knex.SchemaBuilder | Knex.QueryBuilder
): SqlQuery | SqlQuery[] {
  let sql = query.toSQL()
  if (Array.isArray(sql)) {
    return sql as SqlQuery[]
  }
  let native: Knex.SqlNative | undefined
  if (sql.toNative) {
    native = sql.toNative()
  }
  return {
    sql: native?.sql || sql.sql,
    bindings: native?.bindings || sql.bindings,
  } as SqlQuery
}

export function isExternalTable(table: Table) {
  if (
    table?.sourceId &&
    table.sourceId.includes(DocumentType.DATASOURCE + SEPARATOR) &&
    table?.sourceId !== DEFAULT_BB_DATASOURCE_ID
  ) {
    return true
  } else if (table?.sourceType === TableSourceType.EXTERNAL) {
    return true
  } else if (table?._id && isExternalTableID(table._id)) {
    return true
  }
  return false
}

export function buildExternalTableId(datasourceId: string, tableName: string) {
  // encode spaces
  if (tableName.includes(" ")) {
    tableName = encodeURIComponent(tableName)
  }
  return `${datasourceId}${DOUBLE_SEPARATOR}${tableName}`
}

export function breakExternalTableId(tableId: string | undefined) {
  if (!tableId) {
    return {}
  }
  const parts = tableId.split(DOUBLE_SEPARATOR)
  let datasourceId = parts.shift()
  // if they need joined
  let tableName = parts.join(DOUBLE_SEPARATOR)
  // if contains encoded spaces, decode it
  if (tableName.includes(ENCODED_SPACE)) {
    tableName = decodeURIComponent(tableName)
  }
  return { datasourceId, tableName }
}

export function generateRowIdField(keyProps: any[] = []) {
  if (!Array.isArray(keyProps)) {
    keyProps = [keyProps]
  }
  for (let index in keyProps) {
    if (keyProps[index] instanceof Buffer) {
      keyProps[index] = keyProps[index].toString()
    }
  }
  // this conserves order and types
  // we have to swap the double quotes to single quotes for use in HBS statements
  // when using the literal helper the double quotes can break things
  return encodeURIComponent(JSON.stringify(keyProps).replace(/"/g, "'"))
}

export function isRowId(field: any) {
  return (
    Array.isArray(field) ||
    (typeof field === "string" && field.match(ROW_ID_REGEX) != null)
  )
}

export function convertRowId(field: any) {
  if (Array.isArray(field)) {
    return field[0]
  }
  if (typeof field === "string" && field.match(ROW_ID_REGEX) != null) {
    return field.substring(1, field.length - 1)
  }
  return field
}

// should always return an array
export function breakRowIdField(_id: string | { _id: string }): any[] {
  if (!_id) {
    return []
  }
  // have to replace on the way back as we swapped out the double quotes
  // when encoding, but JSON can't handle the single quotes
  const id = typeof _id === "string" ? _id : _id._id
  const decoded: string = decodeURIComponent(id).replace(/'/g, '"')
  try {
    const parsed = JSON.parse(decoded)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch (err) {
    // wasn't json - likely was handlebars for a many to many
    return [_id]
  }
}

export function generateColumnDefinition(config: {
  externalType: string
  autocolumn: boolean
  name: string
  presence: boolean
  options?: string[]
}) {
  let { externalType, autocolumn, name, presence, options } = config
  let foundType = FieldType.STRING
  const lowerCaseType = externalType.toLowerCase()
  let matchingTypes = []
  for (let [external, internal] of Object.entries(SQL_TYPE_MAP)) {
    if (lowerCaseType.includes(external)) {
      matchingTypes.push({ external, internal })
    }
  }
  // Set the foundType based the longest match
  if (matchingTypes.length > 0) {
    foundType = matchingTypes.reduce((acc, val) => {
      return acc.external.length >= val.external.length ? acc : val
    }).internal
  }

  const constraints: {
    presence: boolean
    inclusion?: string[]
  } = {
    presence,
  }
  if (foundType === FieldType.OPTIONS) {
    constraints.inclusion = options
  }

  const schema: FieldSchema = {
    type: foundType,
    externalType,
    autocolumn,
    name,
    constraints,
  }
  if (schema.type === FieldType.DATETIME) {
    schema.dateOnly = SQL_DATE_ONLY_TYPES.includes(lowerCaseType)
    schema.timeOnly = SQL_TIME_ONLY_TYPES.includes(lowerCaseType)
  }
  return schema
}

export function getSqlQuery(query: SqlQuery | string): SqlQuery {
  if (typeof query === "string") {
    return { sql: query }
  } else {
    return query
  }
}

export function isSQL(datasource: Datasource) {
  return helpers.isSQL(datasource)
}

export function isIsoDateString(str: string) {
  const trimmedValue = str.trim()
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(trimmedValue)) {
    return false
  }
  let d = new Date(trimmedValue)
  return d.toISOString() === trimmedValue
}

/**
 * Looks for columns which need to be copied over into the new table definitions, like relationships,
 * options types and views.
 * @param tableName The name of the table which is being checked.
 * @param table The specific table which is being checked.
 * @param entities All the tables that existed before - the old table definitions.
 * @param tableIds The IDs of the tables which exist now, to check if anything has been removed.
 */
function copyExistingPropsOver(
  tableName: string,
  table: Table,
  entities: Record<string, Table>,
  tableIds: string[]
): Table {
  if (entities && entities[tableName]) {
    if (entities[tableName]?.primaryDisplay) {
      table.primaryDisplay = entities[tableName].primaryDisplay
    }
    if (entities[tableName]?.created) {
      table.created = entities[tableName]?.created
    }
    if (entities[tableName]?.constrained) {
      table.constrained = entities[tableName]?.constrained
    }

    table.views = entities[tableName].views

    const existingTableSchema = entities[tableName].schema
    for (let key in existingTableSchema) {
      if (!Object.prototype.hasOwnProperty.call(existingTableSchema, key)) {
        continue
      }

      const column = existingTableSchema[key]

      const existingColumnType = column?.type
      const updatedColumnType = table.schema[key]?.type

      const keepIfType = (...validTypes: PrimitiveTypes[]) => {
        return (
          isPrimitiveType(updatedColumnType) &&
          table.schema[key] &&
          validTypes.includes(updatedColumnType)
        )
      }

      let shouldKeepSchema = false
      switch (existingColumnType) {
        case FieldType.FORMULA:
        case FieldType.AUTO:
        case FieldType.INTERNAL:
          shouldKeepSchema = true
          break

        case FieldType.LINK:
          shouldKeepSchema =
            existingColumnType === FieldType.LINK &&
            tableIds.includes(column.tableId)
          break

        case FieldType.STRING:
        case FieldType.OPTIONS:
        case FieldType.LONGFORM:
        case FieldType.BARCODEQR:
          shouldKeepSchema = keepIfType(FieldType.STRING)
          break

        case FieldType.NUMBER:
        case FieldType.BOOLEAN:
          shouldKeepSchema = keepIfType(FieldType.BOOLEAN, FieldType.NUMBER)
          break

        case FieldType.ARRAY:
        case FieldType.ATTACHMENTS:
        case FieldType.ATTACHMENT_SINGLE:
        case FieldType.SIGNATURE_SINGLE:
        case FieldType.JSON:
        case FieldType.BB_REFERENCE:
        case FieldType.BB_REFERENCE_SINGLE:
          shouldKeepSchema = keepIfType(FieldType.JSON, FieldType.STRING)
          break

        case FieldType.DATETIME:
          shouldKeepSchema = keepIfType(FieldType.DATETIME, FieldType.STRING)
          break

        case FieldType.BIGINT:
          shouldKeepSchema = keepIfType(FieldType.BIGINT, FieldType.NUMBER)
          break

        default:
          utils.unreachable(existingColumnType)
      }

      if (shouldKeepSchema) {
        table.schema[key] = {
          ...existingTableSchema[key],
          externalType:
            existingTableSchema[key].externalType ||
            table.schema[key]?.externalType,
        }
      }
    }
  }
  return table
}

/**
 * Look through the final table definitions to see if anything needs to be
 * copied over from the old.
 * @param tables The list of tables that have been retrieved from the external database.
 * @param entities The old list of tables, if there was any to look for definitions in.
 */
export function finaliseExternalTables(
  tables: Record<string, Table>,
  entities: Record<string, Table>
): Record<string, Table> {
  let finalTables: Record<string, Table> = {}
  const tableIds = Object.values(tables).map(table => table._id!)
  for (let [name, table] of Object.entries(tables)) {
    finalTables[name] = copyExistingPropsOver(name, table, entities, tableIds)
  }
  // sort the tables by name, this is for the UI to display them in alphabetical order
  return Object.entries(finalTables)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
}

export function checkExternalTables(
  tables: Record<string, Table>
): Record<string, string> {
  const invalidColumns = Object.values(InvalidColumns) as string[]
  const errors: Record<string, string> = {}
  for (let [name, table] of Object.entries(tables)) {
    if (!table.primary || table.primary.length === 0) {
      errors[name] = "Table must have a primary key."
    }

    const columnNames = Object.keys(table.schema)
    if (columnNames.find(f => invalidColumns.includes(f))) {
      errors[name] = "Table contains invalid columns."
    }
  }
  return errors
}

/**
 * Checks if the provided input is an object, but specifically not a date type object.
 * Used during coercion of types and relationship handling, dates are considered valid
 * and can be used as a display field, but objects and arrays cannot.
 * @param testValue an unknown type which this function will attempt to extract
 * a valid primary display string from.
 */
export function getPrimaryDisplay(testValue: unknown): string | undefined {
  if (testValue instanceof Date) {
    return testValue.toISOString()
  }
  if (
    Array.isArray(testValue) &&
    testValue[0] &&
    typeof testValue[0] !== "object"
  ) {
    return testValue.join(", ")
  }
  if (typeof testValue === "object") {
    return undefined
  }
  return testValue as string
}

export function isValidFilter(value: any) {
  return value != null && value !== ""
}

export async function handleXml(rawXml: string) {
  let data
  data =
    (await xmlParser(rawXml, {
      explicitArray: false,
      trim: true,
      explicitRoot: false,
    })) || {}
  // there is only one structure, its an array, return the array so it appears as rows
  const keys = Object.keys(data)
  if (keys.length === 1 && Array.isArray(data[keys[0]])) {
    data = data[keys[0]]
  }
  return { data, rawXml }
}

export async function handleFileResponse(
  response: any,
  filename: string,
  startTime: number
) {
  let presignedUrl,
    size = 0
  const fileExtension = filename.includes(".")
    ? filename.split(".").slice(1).join(".")
    : ""

  const processedFileName = `${v4()}.${fileExtension}`
  const key = `${context.getProdAppId()}/${processedFileName}`
  const bucket = objectStore.ObjectStoreBuckets.TEMP

  const stream = response.body.pipe(bl((error, data) => data))

  if (response.body) {
    const contentLength = response.headers.get("content-length")
    if (contentLength) {
      size = parseInt(contentLength, 10)
    } else {
      const chunks: Buffer[] = []
      for await (const chunk of response.body) {
        chunks.push(chunk)
        size += chunk.length
      }
    }

    await objectStore.streamUpload({
      bucket,
      filename: key,
      stream,
      ttl: 1,
      type: response.headers["content-type"],
    })
  }
  presignedUrl = await objectStore.getPresignedUrl(bucket, key)
  return {
    data: {
      size,
      name: processedFileName,
      url: presignedUrl,
      extension: fileExtension,
      key: key,
    },
    info: {
      code: response.status,
      size: formatBytes(size.toString()),
      time: `${Math.round(performance.now() - startTime)}ms`,
    },
  }
}

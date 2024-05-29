import {
  SqlQuery,
  Table,
  Datasource,
  FieldType,
  FieldSchema,
} from "@budibase/types"
import { context, objectStore, sql } from "@budibase/backend-core"
import { v4 } from "uuid"
import { parseStringPromise as xmlParser } from "xml2js"
import { formatBytes } from "../../utilities"
import bl from "bl"
import env from "../../environment"
import { InvalidColumns } from "../../constants"
import { helpers, utils } from "@budibase/shared-core"

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

export const isExternalTableID = sql.utils.isExternalTableID
export const isExternalTable = sql.utils.isExternalTable
export const buildExternalTableId = sql.utils.buildExternalTableId
export const breakExternalTableId = sql.utils.breakExternalTableId
export const generateRowIdField = sql.utils.generateRowIdField
export const isRowId = sql.utils.isRowId
export const convertRowId = sql.utils.convertRowId
export const breakRowIdField = sql.utils.breakRowIdField
export const isValidFilter = sql.utils.isValidFilter

const isCloud = env.isProd() && !env.SELF_HOSTED
const isSelfHost = env.isProd() && env.SELF_HOSTED
export const HOST_ADDRESS = isSelfHost
  ? "host.docker.internal"
  : isCloud
  ? ""
  : "localhost"

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

export async function handleXml(rawXml: string) {
  let data =
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
    }

    await objectStore.streamUpload({
      bucket,
      filename: key,
      stream,
      ttl: 1,
      type: response.headers["content-type"],
    })
  }
  presignedUrl = objectStore.getPresignedUrl(bucket, key)
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

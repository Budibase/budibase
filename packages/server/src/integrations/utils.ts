import { SqlQuery } from "../definitions/datasource"
import { Datasource, Table } from "../definitions/common"
import { SourceNames } from "../definitions/datasource"
const { DocumentTypes, SEPARATOR } = require("../db/utils")
const {
  FieldTypes,
  BuildSchemaErrors,
  InvalidColumns,
} = require("../constants")

const DOUBLE_SEPARATOR = `${SEPARATOR}${SEPARATOR}`
const ROW_ID_REGEX = /^\[.*]$/g

const SQL_TYPE_MAP = {
  text: FieldTypes.LONGFORM,
  varchar: FieldTypes.STRING,
  integer: FieldTypes.NUMBER,
  bigint: FieldTypes.NUMBER,
  decimal: FieldTypes.NUMBER,
  smallint: FieldTypes.NUMBER,
  real: FieldTypes.NUMBER,
  "double precision": FieldTypes.NUMBER,
  timestamp: FieldTypes.DATETIME,
  time: FieldTypes.DATETIME,
  boolean: FieldTypes.BOOLEAN,
  json: FieldTypes.JSON,
  date: FieldTypes.DATETIME,
  blob: FieldTypes.LONGFORM,
  enum: FieldTypes.STRING,
  float: FieldTypes.NUMBER,
  int: FieldTypes.NUMBER,
  numeric: FieldTypes.NUMBER,
  mediumint: FieldTypes.NUMBER,
  dec: FieldTypes.NUMBER,
  double: FieldTypes.NUMBER,
  fixed: FieldTypes.NUMBER,
  datetime: FieldTypes.DATETIME,
  tinyint: FieldTypes.BOOLEAN,
  long: FieldTypes.LONGFORM,
  number: FieldTypes.NUMBER,
  binary_float: FieldTypes.NUMBER,
  binary_double: FieldTypes.NUMBER,
}

export enum SqlClients {
  MS_SQL = "mssql",
  POSTGRES = "pg",
  MY_SQL = "mysql",
  ORACLE = "oracledb",
}

export function isExternalTable(tableId: string) {
  return tableId.includes(DocumentTypes.DATASOURCE)
}

export function buildExternalTableId(datasourceId: string, tableName: string) {
  return `${datasourceId}${DOUBLE_SEPARATOR}${tableName}`
}

export function breakExternalTableId(tableId: string) {
  const parts = tableId.split(DOUBLE_SEPARATOR)
  let tableName = parts.pop()
  // if they need joined
  let datasourceId = parts.join(DOUBLE_SEPARATOR)
  return { datasourceId, tableName }
}

export function generateRowIdField(keyProps: any[] = []) {
  if (!Array.isArray(keyProps)) {
    keyProps = [keyProps]
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

export function convertSqlType(type: string) {
  for (let [external, internal] of Object.entries(SQL_TYPE_MAP)) {
    if (type.toLowerCase().includes(external)) {
      return internal
    }
  }
  return FieldTypes.STRING
}

export function getSqlQuery(query: SqlQuery | string): SqlQuery {
  if (typeof query === "string") {
    return { sql: query }
  } else {
    return query
  }
}

export function isSQL(datasource: Datasource): boolean {
  if (!datasource || !datasource.source) {
    return false
  }
  const SQL = [SourceNames.POSTGRES, SourceNames.SQL_SERVER, SourceNames.MYSQL]
  return SQL.indexOf(datasource.source) !== -1
}

export function isIsoDateString(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) {
    return false
  }
  let d = new Date(str)
  return d.toISOString() === str
}

// add the existing relationships from the entities if they exist, to prevent them from being overridden
function copyExistingPropsOver(
  tableName: string,
  table: Table,
  entities: { [key: string]: any }
) {
  if (entities && entities[tableName]) {
    if (entities[tableName].primaryDisplay) {
      table.primaryDisplay = entities[tableName].primaryDisplay
    }
    const existingTableSchema = entities[tableName].schema
    for (let key in existingTableSchema) {
      if (!existingTableSchema.hasOwnProperty(key)) {
        continue
      }
      if (existingTableSchema[key].type === "link") {
        table.schema[key] = existingTableSchema[key]
      }
    }
  }
  return table
}

export function finaliseExternalTables(
  tables: { [key: string]: any },
  entities: { [key: string]: any }
) {
  const invalidColumns = Object.values(InvalidColumns)
  let finalTables: { [key: string]: any } = {}
  const errors: { [key: string]: string } = {}
  for (let [name, table] of Object.entries(tables)) {
    const schemaFields = Object.keys(table.schema)
    // make sure every table has a key
    if (table.primary == null || table.primary.length === 0) {
      errors[name] = BuildSchemaErrors.NO_KEY
      continue
    } else if (schemaFields.find(field => invalidColumns.includes(field))) {
      errors[name] = BuildSchemaErrors.INVALID_COLUMN
      continue
    }
    // make sure all previous props have been added back
    finalTables[name] = copyExistingPropsOver(name, table, entities)
  }
  // sort the tables by name
  finalTables = Object.entries(finalTables)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
  return { tables: finalTables, errors }
}

import { DocumentType, SqlQuery, Table, TableSourceType } from "@budibase/types"
import { DEFAULT_BB_DATASOURCE_ID } from "../constants"
import { Knex } from "knex"
import { SEPARATOR } from "../db"

const DOUBLE_SEPARATOR = `${SEPARATOR}${SEPARATOR}`
const ROW_ID_REGEX = /^\[.*]$/g
const ENCODED_SPACE = encodeURIComponent(" ")

export function isExternalTableID(tableId: string) {
  return tableId.startsWith(DocumentType.DATASOURCE + SEPARATOR)
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

export function breakExternalTableId(tableId: string) {
  const parts = tableId.split(DOUBLE_SEPARATOR)
  let datasourceId = parts.shift()
  // if they need joined
  let tableName = parts.join(DOUBLE_SEPARATOR)
  // if contains encoded spaces, decode it
  if (tableName.includes(ENCODED_SPACE)) {
    tableName = decodeURIComponent(tableName)
  }
  if (!datasourceId || !tableName) {
    throw new Error("Unable to get datasource/table name from table ID")
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

export function isIsoDateString(str: string) {
  const trimmedValue = str.trim()
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(trimmedValue)) {
    return false
  }
  let d = new Date(trimmedValue)
  return d.toISOString() === trimmedValue
}

export function isValidFilter(value: any) {
  return value != null && value !== ""
}

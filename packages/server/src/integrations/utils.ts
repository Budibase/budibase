import { SqlQuery } from "../definitions/datasource"
const { DocumentTypes, SEPARATOR } = require("../db/utils")
const { FieldTypes } = require("../constants")

const DOUBLE_SEPARATOR = `${SEPARATOR}${SEPARATOR}`

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
  return encodeURIComponent(JSON.stringify(keyProps).replace(/"/g, "'"))
}

// should always return an array
export function breakRowIdField(_id: string) {
  if (!_id) {
    return null
  }
  const decoded = decodeURIComponent(_id)
  const parsed = JSON.parse(decoded)
  return Array.isArray(parsed) ? parsed : [parsed]
}

export function convertType(type: string, map: { [key: string]: any }) {
  for (let [external, internal] of Object.entries(map)) {
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

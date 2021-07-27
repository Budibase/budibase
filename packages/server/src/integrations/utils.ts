import { SqlQuery } from "../definitions/datasource"
import { Datasource } from "../definitions/common"
import { SourceNames } from "../definitions/datasource"
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
  // we have to swap the double quotes to single quotes for use in HBS statements
  // when using the literal helper the double quotes can break things
  return encodeURIComponent(JSON.stringify(keyProps).replace(/"/g, "'"))
}

// should always return an array
export function breakRowIdField(_id: string): any[] {
  if (!_id) {
    return []
  }
  // have to replace on the way back as we swapped out the double quotes
  // when encoding, but JSON can't handle the single quotes
  const decoded: string = decodeURIComponent(_id).replace(/'/g, '"')
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

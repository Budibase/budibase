import { Datasource, SourceName } from "@budibase/types"

export function isGoogleSheets(type: SourceName) {
  return type === SourceName.GOOGLE_SHEETS
}

export function isSQL(datasource: Datasource): boolean {
  if (!datasource || !datasource.source) {
    return false
  }
  const SQL = [
    SourceName.POSTGRES,
    SourceName.SQL_SERVER,
    SourceName.MYSQL,
    SourceName.ORACLE,
  ]
  return SQL.indexOf(datasource.source) !== -1 || datasource.isSQL === true
}

export function hasExtendedTypes(datasource: Datasource): boolean {
  if (!datasource || !datasource.source) {
    return false
  }
  const EXTENDED_TYPE_DATASOURCES = [SourceName.MONGODB]
  return EXTENDED_TYPE_DATASOURCES.indexOf(datasource.source) !== -1
}

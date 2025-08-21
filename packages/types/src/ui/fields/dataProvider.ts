import { TableSchema, UIDatasourceType, Row, JSONValue } from "../../"

export interface UIFieldDataProviderContext {
  rows: Row[]
  datasource: {
    label: string
    tableId?: string
    resourceId?: string
    type: UIDatasourceType
  }
  schema?: TableSchema
  rowsLength: number
  pageNumber?: number
  id?: string
  state?: {
    query: JSONValue
  }
  limit?: number
  primaryDisplay: string
  loaded: boolean
}

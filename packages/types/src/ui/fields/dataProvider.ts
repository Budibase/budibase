import { FieldSchema, UIDatasourceType, Row, JSONValue } from "../../"

export type UIFieldDataProviderSchema = FieldSchema & {
  optionColors?: Record<string, string>
}

export interface UIFieldDataProvider {
  rows: Row[]
  datasource: {
    label: string
    tableId?: string
    resourceId?: string
    type: UIDatasourceType
  }
  schema: Record<string, UIFieldDataProviderSchema>
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
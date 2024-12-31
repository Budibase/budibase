import {
  Row,
  SortOrder,
  Table,
  UIDatasource,
  UILegacyFilter,
  UISearchFilter,
} from "@budibase/types"

export interface UIFetchAPI {
  fetchTableDefinition(tableId: string): Promise<Table>
  definition: UIDatasource

  getInitialData: () => Promise<void>
  loading: any
  loaded: boolean

  resetKey: string | null
  error: any

  hasNextPage: boolean
  nextPage: () => Promise<void>

  rows: Row[]

  options?: {
    datasource?: {
      tableId: string
      id: string
    }
  }
  update: ({
    sortOrder,
    sortColumn,
  }: {
    sortOrder?: SortOrder
    sortColumn?: string
    filter?: UILegacyFilter[] | UISearchFilter
  }) => any
}

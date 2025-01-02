import {
  Row,
  SearchFilters,
  SortOrder,
  SortType,
  Table,
  UIDatasource,
  UILegacyFilter,
  UISearchFilter,
} from "@budibase/types"

interface SearchOptions {
  query: SearchFilters | null
  limit: number
  sort: string | null
  sortOrder: string
  sortType: SortType | null
  paginate: boolean
  bookmark: null
}

export interface UIFetchAPI {
  fetchTableDefinition(tableId: string): Promise<Table>
  definition: UIDatasource

  getInitialData: () => Promise<void>
  loading: any
  loaded: boolean

  searchTable(tableId: string, options: SearchOptions): any

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

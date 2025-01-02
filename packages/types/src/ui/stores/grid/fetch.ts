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
  query?: SearchFilters | null | undefined
  limit: number
  sort: string | null
  sortOrder: string | undefined
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

  viewV2: {
    fetchDefinition: (datasourceId: string) => Promise<any>
    fetch: (datasourceId: string, options: SearchOptions) => any
  }

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

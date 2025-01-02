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

interface TableAPI {
  fetchTableDefinition(tableId: string): Promise<Table>
  searchTable(tableId: string, options: SearchOptions): any
}

interface ViewV2API {
  fetchDefinition: (datasourceId: string) => Promise<any>
  fetch: (datasourceId: string, options: SearchOptions) => any
}

interface UserAPI {
  searchUsers: (opts: {
    bookmark: null
    query:
      | SearchFilters
      | {
          string: {
            email: null
          }
        }
      | null
    appId: string
    paginate: boolean
    limit: number
  }) => Promise<any>
}

export interface UIFetchAPI extends TableAPI, UserAPI {
  definition: UIDatasource

  getInitialData: () => Promise<void>
  loading: any
  loaded: boolean

  viewV2: ViewV2API

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

import { LegacyFilter, SortOrder, UISearchFilter } from "../../api"
import { SearchFilters } from "../../sdk"
import { SortField } from "../../shared"

export * from "./datasources"

export interface DataFetchOptions<TQuery = SearchFilters> {
  // Search config
  filter: UISearchFilter | LegacyFilter[] | null
  query: TQuery
  // Sorting config
  sortColumn: string | null
  sortOrder: SortOrder
  sorts?: SortField[] | null
  // Pagination config
  limit: number
  paginate: boolean
}

import { LegacyFilter, SortOrder, UISearchFilter } from "../../api"
import { SearchFilters } from "../../sdk"
import { RowSortOption } from "../../sdk/row"

export * from "./datasources"

export interface DataFetchOptions<TQuery = SearchFilters> {
  // Search config
  filter: UISearchFilter | LegacyFilter[] | null
  query: TQuery
  // Sorting config
  sortColumn: string | null
  sortOrder: SortOrder
  sorts?: RowSortOption[]
  // Pagination config
  limit: number
  paginate: boolean
}

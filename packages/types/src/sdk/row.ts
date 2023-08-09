import { SortOrder, SortType } from "../api"
import { SearchFilters } from "./search"

export interface SearchParams {
  tableId: string
  paginate?: boolean
  query: SearchFilters
  bookmark?: string
  limit?: number
  sort?: string
  sortOrder?: SortOrder
  sortType?: SortType
  version?: string
  disableEscaping?: boolean
  fields?: string[]
}

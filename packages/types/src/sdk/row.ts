import { SortOrder, SortType } from "../api"
import { SearchFilters } from "./search"
import { Row } from "../documents"

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

export interface SearchResponse {
  rows: Row[]
  hasNextPage?: boolean
  bookmark?: string | number
}

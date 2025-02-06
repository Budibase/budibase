import { SortOrder, SortType } from "../api"
import { SearchFilters } from "./search"
import { CalculationType, Row } from "../documents"
import { WithRequired } from "../shared"

export interface BaseAggregation {
  name: string
}

export interface NumericAggregation extends BaseAggregation {
  calculationType:
    | CalculationType.AVG
    | CalculationType.MAX
    | CalculationType.MIN
    | CalculationType.SUM
  field: string
}

export interface CountAggregation extends BaseAggregation {
  calculationType: CalculationType.COUNT
  field: string
}

export interface CountDistinctAggregation extends CountAggregation {
  distinct: true
}

export type Aggregation =
  | NumericAggregation
  | CountAggregation
  | CountDistinctAggregation

export interface SearchParams {
  tableId?: string
  viewId?: string
  query?: SearchFilters
  paginate?: boolean
  bookmark?: string | number
  limit?: number
  sort?: string
  sortOrder?: SortOrder
  sortType?: SortType
  version?: string
  disableEscaping?: boolean
  fields?: string[]
  indexer?: () => Promise<any>
  rows?: Row[]
  countRows?: boolean
}

// when searching for rows we want a more extensive search type that requires certain properties
export interface RowSearchParams
  extends WithRequired<SearchParams, "tableId" | "query"> {}

export interface SearchResponse<T> {
  rows: T[]
  hasNextPage?: boolean
  bookmark?: string | number
  totalRows?: number
}

export enum RowExportFormat {
  CSV = "csv",
  JSON = "json",
  JSON_WITH_SCHEMA = "jsonWithSchema",
}

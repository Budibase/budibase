import { FieldType } from "../../documents"
import { EmptyFilterOption, UILogicalOperator, SearchFilters } from "../../sdk"

// Prior to v2, this is the type the frontend sent us when filters were
// involved. We convert this to a SearchFilters before use with the search SDK.
export type LegacyFilter = {
  operator: keyof SearchFilters | "rangeLow" | "rangeHigh"
  onEmptyFilter?: EmptyFilterOption
  field: string
  type?: FieldType
  value: any
  externalType?: string
}

export type SearchFilterGroup = {
  logicalOperator?: UILogicalOperator
  groups?: SearchFilterGroup[]
  filters?: LegacyFilter[]
}

// As of v3, this is the format that the frontend always sends when search
// filters are involved. We convert this to SearchFilters before use with the
// search SDK.
//
// The reason we migrated was that we started to support "logical operators" in
// tests and SearchFilters because a recursive data structure. LegacyFilter[]
// wasn't able to support these sorts of recursive structures, so we changed the
// format.
export type UISearchFilter = {
  logicalOperator?: UILogicalOperator
  onEmptyFilter?: EmptyFilterOption
  groups?: SearchFilterGroup[]
}

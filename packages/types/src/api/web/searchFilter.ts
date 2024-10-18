import { FieldType } from "../../documents"
import { EmptyFilterOption, UILogicalOperator, SearchFilters } from "../../sdk"

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

// this is a type purely used by the UI
export type UISearchFilter = {
  logicalOperator?: UILogicalOperator
  onEmptyFilter?: EmptyFilterOption
  groups?: SearchFilterGroup[]
}

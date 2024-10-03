import { FieldType } from "../../documents"
import {
  EmptyFilterOption,
  FilterGroupLogicalOperator,
  SearchFilters,
} from "../../sdk"

export type LegacyFilter = {
  operator: keyof SearchFilters | "rangeLow" | "rangeHigh"
  onEmptyFilter?: EmptyFilterOption
  field: string
  type?: FieldType
  value: any
  externalType?: string
}

// this is a type purely used by the UI
export type SearchFilterGroup = {
  logicalOperator: FilterGroupLogicalOperator
  onEmptyFilter?: EmptyFilterOption
  groups?: SearchFilterGroup[]
  filters?: LegacyFilter[]
}

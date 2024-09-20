import { FieldType } from "../../documents"
import {
  EmptyFilterOption,
  FilterGroupLogicalOperator,
  SearchFilters,
} from "../../sdk"

export type SearchFilter = {
  operator: keyof SearchFilters | "rangeLow" | "rangeHigh"
  onEmptyFilter?: EmptyFilterOption
  field: string
  type?: FieldType
  value: any
  externalType?: string
}

export type SearchFilterGroup = {
  logicalOperator: FilterGroupLogicalOperator
  onEmptyFilter?: EmptyFilterOption
  groups?: SearchFilterGroup[]
  filters?: SearchFilter[]
}

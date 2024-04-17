import { FieldType } from "../../documents"
import { EmptyFilterOption, SearchFilters } from "../../sdk"

export type SearchFilter = {
  operator: keyof SearchFilters | "rangeLow" | "rangeHigh"
  onEmptyFilter?: EmptyFilterOption
  field: string
  type?: FieldType
  value: any
  externalType?: string
}

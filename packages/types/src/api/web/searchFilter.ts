import { FieldType } from "../../documents"
import {
  EmptyFilterOption,
  UILogicalOperator,
  BasicOperator,
  RangeOperator,
  ArrayOperator,
} from "../../sdk"

type AllOr = {
  operator: "allOr"
}

type OnEmptyFilter = {
  onEmptyFilter: EmptyFilterOption
}

// TODO(samwho): this could be broken down further
export type SearchFilter = {
  operator:
    | BasicOperator
    | RangeOperator
    | ArrayOperator
    | "rangeLow"
    | "rangeHigh"
  // Field name will often have a numerical prefix when coming from the frontend,
  // use the ColumnSplitter class to remove it.
  field: string
  value: any
  type?: FieldType
  externalType?: string
  noValue?: boolean
  valueType?: string
  formulaType?: string
}

// Prior to v2, this is the type the frontend sent us when filters were
// involved. We convert this to a SearchFilters before use with the search SDK.
export type LegacyFilter = AllOr | OnEmptyFilter | SearchFilter

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

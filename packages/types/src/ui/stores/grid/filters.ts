import { FieldType, UILogicalOperator } from "@budibase/types"

export interface UIFilter {
  groups: {
    logicalOperator: UILogicalOperator
    filters: UIInlineFilter[]
  }[]
}

export interface UIInlineFilter {
  field: string
  type: FieldType
  value: number | string
  operator: string
  id: string
  valueType: string
}

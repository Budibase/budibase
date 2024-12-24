import { FieldType } from "@budibase/types"

export interface UIInlineFilter {
  field: string
  type: FieldType
  value: number | string
  operator: string
  id: string
  valueType: string
}

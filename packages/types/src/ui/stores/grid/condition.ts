import { FieldType, SearchFilter } from "@budibase/types"

export interface UICondition {
  column: string
  type: FieldType
  referenceValue: any
  operator: SearchFilter["operator"]
  metadataKey: string
  metadataValue: string
  target: string
}

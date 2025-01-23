import { CalculationType, FieldSchema, FieldType } from "@budibase/types"

export type UIColumn = FieldSchema & {
  label: string
  readonly: boolean
  conditions: any
  related?: {
    field: string
    subField: string
  }
  primaryDisplay?: boolean
  schema: {
    disabled: boolean
    type: FieldType
    readonly: boolean
    autocolumn: boolean
    cellRenderType?: FieldType | "role"
  }
  calculationType: CalculationType
  __idx: number
  __left: number
  width: number
}

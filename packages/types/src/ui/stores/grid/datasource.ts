import { UITable, UIView } from "@budibase/types"

export type UIDatasource = (UITable | UIView) & {
  type: string
}

export interface UIFieldMutation {
  visible?: boolean
  readonly?: boolean
  width?: number
  order?: number
}

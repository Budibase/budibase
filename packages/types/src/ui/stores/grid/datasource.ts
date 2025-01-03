import { UITable, UIView } from "@budibase/types"

export type UIDatasource = UITable | UIView

export interface UIFieldMutation {
  visible?: boolean
  readonly?: boolean
  width?: number
  order?: number
}

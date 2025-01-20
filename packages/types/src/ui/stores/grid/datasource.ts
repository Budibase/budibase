import { UITable, UIView } from "@budibase/types"

export type UIDatasource = UITable | (Omit<UIView, "type"> & { type: "viewV2" })

export interface UIFieldMutation {
  visible?: boolean
  readonly?: boolean
  width?: number
  order?: number
}

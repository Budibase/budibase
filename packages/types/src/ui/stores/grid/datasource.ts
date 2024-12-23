import { SortOrder } from "@budibase/types"

export interface UIDatasource {
  type: string
  id: string
  tableId: string
  sort?: {
    field: string
    order?: SortOrder
  }
  queryUI: any // TODO
}

export interface UIFieldMutation {
  visible: boolean
  readonly?: boolean
}

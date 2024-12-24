import { SortOrder, UIFieldSchema } from "@budibase/types"

export interface UIDatasource {
  type: string
  id: string
  tableId: string
  primaryDisplay?: string
  sort?: {
    field: string
    order?: SortOrder
  }
  queryUI: any // TODO
  schema: Record<string, UIFieldSchema>
}

export interface UIFieldMutation {
  visible: boolean
  readonly?: boolean
}

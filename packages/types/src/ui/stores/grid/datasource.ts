import { SortOrder, UIFieldSchema, UISearchFilter } from "@budibase/types"

export interface UIDatasource {
  type: string
  name: string
  id: string
  tableId: string
  primaryDisplay?: string
  sort?: {
    field: string
    order: SortOrder
  }
  queryUI: UISearchFilter
  schema: Record<string, UIFieldSchema>
}

export interface UIFieldMutation {
  visible: boolean
  readonly?: boolean
}

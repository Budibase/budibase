import { SortOrder, UIFieldSchema, UISearchFilter } from "@budibase/types"

export type UIDatasource = UITable | UIView

export interface UITable {
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

export interface UIView {
  type: string
  version: 2
  id: string
  tableId: string
  sort?: {
    field: string
    order: SortOrder
  }
  queryUI: UISearchFilter
}

export interface UIFieldMutation {
  visible: boolean
  readonly?: boolean
}

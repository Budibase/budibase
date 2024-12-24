import { SortOrder, UISearchFilter } from "@budibase/types"
import { UIFieldSchema } from "./table"

export interface UIView {
  type: string
  version: 2
  id: string
  tableId: string
  primaryDisplay?: string
  schema: Record<string, UIFieldSchema>
  sort?: {
    field: string
    order: SortOrder
  }
  queryUI: UISearchFilter
}

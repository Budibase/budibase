import { SortOrder, SortType } from "../api"

export interface SortField {
  field: string
  order?: SortOrder
  type?: SortType
}

import { Row } from "../../../documents"
import { SortOrder, SortType } from "../pagination"

export interface PatchRowRequest extends Row {
  _id: string
  _rev: string
  tableId: string
}

export interface PatchRowResponse extends Row {}

export interface SearchRequest {
  sort?: {
    column: string
    order?: SortOrder
    type?: SortType
  }
}

export interface SearchResponse {
  rows: any[]
}

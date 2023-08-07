import { SearchParams } from "../../../sdk"
import { Row } from "../../../documents"

export interface PatchRowRequest extends Row {
  _id: string
  _rev: string
  tableId: string
}

export interface PatchRowResponse extends Row {}

export interface SearchRowRequest extends Omit<SearchParams, "tableId"> {}

export interface SearchViewRowRequest
  extends Pick<SearchRowRequest, "sort" | "sortOrder" | "sortType"> {}

export interface SearchRowResponse {
  rows: any[]
}

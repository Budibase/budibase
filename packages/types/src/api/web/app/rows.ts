import { SearchParams } from "../../../sdk"
import { Row } from "../../../documents"

export interface SaveRowRequest extends Row {}

export interface PatchRowRequest extends Row {
  _id: string
  _rev: string
  tableId: string
}

export interface PatchRowResponse extends Row {}

export interface SearchRowRequest extends Omit<SearchParams, "tableId"> {}

export interface SearchViewRowRequest
  extends Pick<
    SearchRowRequest,
    "sort" | "sortOrder" | "sortType" | "limit" | "bookmark" | "paginate"
  > {}

export interface SearchRowResponse {
  rows: any[]
}

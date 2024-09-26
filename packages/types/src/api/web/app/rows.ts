import { SearchFilters, RowSearchParams } from "../../../sdk"
import { Row } from "../../../documents"
import { PaginationResponse, SortOrder } from "../../../api"
import { ReadStream } from "fs"

export interface SaveRowRequest extends Row {}

export interface PatchRowRequest extends Row {
  _id: string
  _rev: string
  tableId: string
}

export interface PatchRowResponse extends Row {}

export interface SearchRowRequest extends Omit<RowSearchParams, "tableId"> {}

export interface SearchViewRowRequest
  extends Pick<
    SearchRowRequest,
    | "sort"
    | "sortOrder"
    | "sortType"
    | "limit"
    | "bookmark"
    | "paginate"
    | "query"
    | "countRows"
  > {}

export interface SearchRowResponse {
  rows: any[]
}

export interface PaginatedSearchRowResponse
  extends SearchRowResponse,
    PaginationResponse {}

export interface ExportRowsRequest {
  rows?: string[]
  columns?: string[]
  query?: SearchFilters
  sort?: string
  sortOrder?: SortOrder
  delimiter?: string
  customHeaders?: { [key: string]: string }
}

export type ExportRowsResponse = ReadStream

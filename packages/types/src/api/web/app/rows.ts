import { SearchFilters, SearchParams } from "../../../sdk"
import { Row } from "../../../documents"
import { ReadStream } from "fs"

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
    | "sort"
    | "sortOrder"
    | "sortType"
    | "limit"
    | "bookmark"
    | "paginate"
    | "query"
  > {}

export interface SearchRowResponse {
  rows: any[]
}

export interface ExportRowsRequest {
  rows: string[]
  columns?: string[]
  query?: SearchFilters
}

export type ExportRowsResponse = ReadStream

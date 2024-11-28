import { SearchFilters } from "../../../../sdk"
import { Row } from "../../../../documents"
import { SortOrder } from "../../../../api/web/pagination"
import { ReadStream } from "fs"

export * from "./search"

export interface SaveRowRequest extends Row {}

export interface PatchRowRequest extends Row {
  _id: string
  _rev: string
  tableId: string
}

export interface PatchRowResponse extends Row {}

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

import { SearchFilters } from "../../../../sdk"
import { Row } from "../../../../documents"
import { SortOrder } from "../../pagination"
import { ReadStream } from "fs"
import stream from "node:stream"

export * from "./search"

export interface FetchEnrichedRowResponse extends Row {}

export type FetchRowsResponse = Row[]

export interface SaveRowRequest extends Row {}
export interface SaveRowResponse extends Row {}

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

export type DownloadAttachmentResponse = stream.PassThrough | stream.Readable

export interface FindRowResponse extends Row {}

export interface DeleteRows {
  rows: (Row | string)[]
}

export interface DeleteRow {
  _id: string
}

export type DeleteRowRequest = DeleteRows | DeleteRow

export interface ValidateRowRequest extends Row {}
export interface ValidateRowResponse {
  valid: boolean
  errors: Record<string, any>
}

import { SearchFilters } from "../../../sdk"
import { Row } from "../../../documents"
import {
  PaginationResponse,
  SortOrder,
  SortType,
} from "../../../api/web/pagination"
import { ReadStream } from "fs"
import { z } from "zod"

export interface SaveRowRequest extends Row {}

export interface PatchRowRequest extends Row {
  _id: string
  _rev: string
  tableId: string
}

export interface PatchRowResponse extends Row {}

const searchRowRequest = z.object({
  query: z.object({
    allOr: z.boolean().optional(),
  }),
  paginate: z.boolean().optional(),
  bookmark: z.union([z.string(), z.number()]).optional(),
  limit: z.number().optional(),
  sort: z.string().optional(),
  sortOrder: z.nativeEnum(SortOrder).optional(),
  sortType: z.nativeEnum(SortType).optional(),
  version: z.string().optional(),
  disableEscaping: z.boolean().optional(),
  countRows: z.boolean().optional(),

  // viewId?: string
  // query?: SearchFilters

  // fields?: string[]
  // indexer?: () => Promise<any>
  // rows?: Row[]
})
export const searchRowRequestValidator = searchRowRequest
export type SearchRowRequest = z.infer<typeof searchRowRequest>

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

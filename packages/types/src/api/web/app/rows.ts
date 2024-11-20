import {
  ArrayOperator,
  BasicOperator,
  EmptyFilterOption,
  InternalSearchFilterOperator,
  LogicalOperator,
  RangeOperator,
  SearchFilterKey,
  SearchFilters,
} from "../../../sdk"
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

const fieldKey = z
  .string()
  .refine(s => s !== InternalSearchFilterOperator.COMPLEX_ID_OPERATOR, {
    message: `Key '${InternalSearchFilterOperator.COMPLEX_ID_OPERATOR}' is not allowed`,
  })

const stringBasicFilter = z.record(fieldKey, z.string())
const basicFilter = z.record(fieldKey, z.any())
const arrayFilter = z.record(fieldKey, z.union([z.any().array(), z.string()]))
const logicFilter = z.lazy(() =>
  z.object({
    conditions: z.array(z.object(queryFilterValidation)),
  })
)

const stringOrNumber = z.union([z.string(), z.number()])

const queryFilterValidation: Record<SearchFilterKey, z.ZodTypeAny> = {
  [BasicOperator.STRING]: stringBasicFilter.optional(),
  [BasicOperator.FUZZY]: stringBasicFilter.optional(),
  [RangeOperator.RANGE]: z
    .record(
      fieldKey,
      z.union([
        z.object({ high: stringOrNumber, low: stringOrNumber }),
        z.object({ high: stringOrNumber }),
        z.object({ low: stringOrNumber }),
      ])
    )
    .optional(),
  [BasicOperator.EQUAL]: basicFilter.optional(),
  [BasicOperator.NOT_EQUAL]: basicFilter.optional(),
  [BasicOperator.EMPTY]: basicFilter.optional(),
  [BasicOperator.NOT_EMPTY]: basicFilter.optional(),
  [ArrayOperator.ONE_OF]: arrayFilter.optional(),
  [ArrayOperator.CONTAINS]: arrayFilter.optional(),
  [ArrayOperator.NOT_CONTAINS]: arrayFilter.optional(),
  [ArrayOperator.CONTAINS_ANY]: arrayFilter.optional(),
  [LogicalOperator.AND]: logicFilter.optional(),
  [LogicalOperator.OR]: logicFilter.optional(),
}

const searchRowRequest = z.object({
  query: z
    .object({
      allOr: z.boolean().optional(),
      onEmptyFilter: z.nativeEnum(EmptyFilterOption).optional(),
      ...queryFilterValidation,
    })
    .optional(),
  paginate: z.boolean().optional(),
  bookmark: z.union([z.string(), z.number()]).nullable().optional(),
  limit: z.number().optional(),
  sort: z.string().optional(),
  sortOrder: z.nativeEnum(SortOrder).optional(),
  sortType: z.nativeEnum(SortType).optional(),
  version: z.string().optional(),
  disableEscaping: z.boolean().optional(),
  countRows: z.boolean().optional(),
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

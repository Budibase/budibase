import {
  Row,
  SearchFilters,
  SearchParams,
  SortOrder,
  SortType,
} from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import * as internal from "./search/internal"
import * as external from "./search/external"
import { Format } from "../../../api/controllers/view/exporters"

export { isValidFilter, removeEmptyFilters } from "../../../integrations/utils"

export interface ViewParams {
  calculation: string
  group: string
  field: string
}

function pickApi(tableId: any) {
  if (isExternalTableID(tableId)) {
    return external
  }
  return internal
}

export async function search(options: SearchParams): Promise<{
  rows: any[]
  hasNextPage?: boolean
  bookmark?: number | null
}> {
  return pickApi(options.tableId).search(options)
}

export interface ExportRowsParams {
  tableId: string
  format: Format
  rowIds?: string[]
  columns?: string[]
  query?: SearchFilters
  sort?: string
  sortOrder?: SortOrder
}

export interface ExportRowsResult {
  fileName: string
  content: string
}

export async function exportRows(
  options: ExportRowsParams
): Promise<ExportRowsResult> {
  return pickApi(options.tableId).exportRows(options)
}

export async function fetch(tableId: string): Promise<Row[]> {
  return pickApi(tableId).fetch(tableId)
}

export async function fetchRaw(tableId: string): Promise<Row[]> {
  return pickApi(tableId).fetchRaw(tableId)
}

export async function fetchView(
  tableId: string,
  viewName: string,
  params: ViewParams
): Promise<Row[]> {
  return pickApi(tableId).fetchView(viewName, params)
}

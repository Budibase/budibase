import { Ctx, SearchFilters } from "@budibase/types"
import { isExternalTable } from "../../../integrations/utils"
import * as internal from "./search/internal"
import * as external from "./search/external"
import { Format } from "../../../api/controllers/view/exporters"

export interface SearchParams {
  tableId: string
  paginate: boolean
  query?: SearchFilters
  bookmark?: number
  limit: number
  sort?: string
  sortOrder?: string
  sortType?: string
}

export interface ViewParams {
  calculation: string
  group: string
  field: string
}

function pickApi(tableId: any) {
  if (isExternalTable(tableId)) {
    return external
  }
  return internal
}

export async function search(tableId: string, ctx: Ctx) {
  return pickApi(tableId).search(ctx)
}

export interface ExportRowsParams {
  tableId: string
  format: Format
  rowIds: string[]
  columns: string[]
  query: string
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

export async function fetch(tableId: string) {
  return pickApi(tableId).fetch(tableId)
}

export async function fetchView(
  tableId: string,
  viewName: string,
  params: ViewParams
) {
  return pickApi(tableId).fetchView(viewName, params)
}

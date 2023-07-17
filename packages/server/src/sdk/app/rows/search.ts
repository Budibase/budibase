import { Ctx, SearchFilters } from "@budibase/types"
import { isExternalTable } from "../../../integrations/utils"
import * as internal from "./search/internal"
import * as external from "./search/external"

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

function pickApi(tableId: any) {
  if (isExternalTable(tableId)) {
    return external
  }
  return internal
}

export async function search(tableId: string, ctx: Ctx) {
  return pickApi(tableId).search(ctx)
}

export async function exportRows(tableId: string, ctx: Ctx) {
  return pickApi(tableId).exportRows(ctx)
}

export async function fetch(tableId: string) {
  return pickApi(tableId).fetch(tableId)
}

export async function fetchView(tableId: string, ctx: Ctx) {
  return pickApi(tableId).fetchView(ctx)
}

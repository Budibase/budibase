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
import { NoEmptyFilterStrings } from "../../../constants"

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

// don't do a pure falsy check, as 0 is included
// https://github.com/Budibase/budibase/issues/10118
export function removeEmptyFilters(filters: SearchFilters) {
  for (let filterField of NoEmptyFilterStrings) {
    if (!filters[filterField]) {
      continue
    }

    for (let filterType of Object.keys(filters)) {
      if (filterType !== filterField) {
        continue
      }
      // don't know which one we're checking, type could be anything
      const value = filters[filterType] as unknown
      if (typeof value === "object") {
        for (let [key, value] of Object.entries(
          filters[filterType] as object
        )) {
          if (value == null || value === "") {
            // @ts-ignore
            delete filters[filterField][key]
          }
        }
      }
    }
  }
  return filters
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
  delimiter?: string
  rowIds?: string[]
  columns?: string[]
  query?: SearchFilters
  sort?: string
  sortOrder?: SortOrder
  customHeaders?: { [key: string]: string }
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

import {
  EmptyFilterOption,
  Row,
  RowSearchParams,
  SearchFilterOperator,
  SearchFilters,
  SearchResponse,
  SortOrder,
} from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import * as internal from "./search/internal"
import * as external from "./search/external"
import { NoEmptyFilterStrings } from "../../../constants"
import * as sqs from "./search/sqs"
import env from "../../../environment"
import { ExportRowsParams, ExportRowsResult } from "./search/types"
import { dataFilters } from "@budibase/shared-core"
import sdk from "../../index"
import { searchInputMapping } from "./search/utils"

export { isValidFilter } from "../../../integrations/utils"

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

function isEmptyArray(value: any) {
  return Array.isArray(value) && value.length === 0
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
          if (value == null || value === "" || isEmptyArray(value)) {
            // @ts-ignore
            delete filters[filterField][key]
          }
        }
      }
    }
  }
  return filters
}

// The frontend can send single values for array fields sometimes, so to handle
// this we convert them to arrays at the controller level so that nothing below
// this has to worry about the non-array values.
function fixupFilterArrays(filters: SearchFilters) {
  const arrayFields = [
    SearchFilterOperator.ONE_OF,
    SearchFilterOperator.CONTAINS,
    SearchFilterOperator.NOT_CONTAINS,
    SearchFilterOperator.CONTAINS_ANY,
  ]
  for (const searchField of arrayFields) {
    const field = filters[searchField]
    if (field == null) {
      continue
    }

    for (const key of Object.keys(field)) {
      if (!Array.isArray(field[key])) {
        field[key] = [field[key]]
      }
    }
  }
  return filters
}

export async function search(
  options: RowSearchParams
): Promise<SearchResponse<Row>> {
  const isExternalTable = isExternalTableID(options.tableId)
  options.query = removeEmptyFilters(options.query || {})
  options.query = fixupFilterArrays(options.query)
  if (
    !dataFilters.hasFilters(options.query) &&
    options.query.onEmptyFilter === EmptyFilterOption.RETURN_NONE
  ) {
    return {
      rows: [],
    }
  }

  if (options.sortOrder) {
    options.sortOrder = options.sortOrder.toLowerCase() as SortOrder
  }

  const table = await sdk.tables.getTable(options.tableId)
  options = searchInputMapping(table, options)

  if (isExternalTable) {
    return external.search(options, table)
  } else if (env.SQS_SEARCH_ENABLE) {
    return sqs.search(options, table)
  } else {
    return internal.search(options, table)
  }
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

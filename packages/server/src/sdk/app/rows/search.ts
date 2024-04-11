import {
  EmptyFilterOption,
  Row,
  RowSearchParams,
  SearchFilters,
  SearchResponse,
} from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import * as internal from "./search/internal"
import * as external from "./search/external"
import { NoEmptyFilterStrings } from "../../../constants"
import * as sqs from "./search/sqs"
import env from "../../../environment"
import { ExportRowsParams, ExportRowsResult } from "./search/types"
import { dataFilters } from "@budibase/shared-core"

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

export async function search(
  options: RowSearchParams
): Promise<SearchResponse<Row>> {
  const isExternalTable = isExternalTableID(options.tableId)
  options.query = removeEmptyFilters(options.query)
  if (
    !dataFilters.hasFilters(options.query) &&
    options.query.onEmptyFilter === EmptyFilterOption.RETURN_NONE
  ) {
    return {
      rows: [],
    }
  }

  if (isExternalTable) {
    return external.search(options)
  } else if (env.SQS_SEARCH_ENABLE) {
    return sqs.search(options)
  } else {
    return internal.search(options)
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

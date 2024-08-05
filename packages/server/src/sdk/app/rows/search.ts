import {
  EmptyFilterOption,
  Row,
  RowSearchParams,
  SearchResponse,
  SortOrder,
} from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import * as internal from "./search/internal"
import * as external from "./search/external"
import { ExportRowsParams, ExportRowsResult } from "./search/types"
import { dataFilters } from "@budibase/shared-core"
import sdk from "../../index"
import { searchInputMapping } from "./search/utils"
import { db as dbCore } from "@budibase/backend-core"

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

export async function search(
  options: RowSearchParams
): Promise<SearchResponse<Row>> {
  const isExternalTable = isExternalTableID(options.tableId)
  options.query = dataFilters.cleanupQuery(options.query || {})
  options.query = dataFilters.fixupFilterArrays(options.query)
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
  } else if (dbCore.isSqsEnabledForTenant()) {
    return internal.sqs.search(options, table)
  } else {
    return internal.lucene.search(options, table)
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

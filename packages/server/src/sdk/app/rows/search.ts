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
import { features } from "@budibase/backend-core"
import tracer from "dd-trace"
import { getQueryableFields, removeInvalidFilters } from "./queryUtils"

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
  return await tracer.trace("search", async span => {
    span?.addTags({
      tableId: options.tableId,
      query: options.query,
      sort: options.sort,
      sortOrder: options.sortOrder,
      sortType: options.sortType,
      limit: options.limit,
      bookmark: options.bookmark,
      paginate: options.paginate,
      fields: options.fields,
      countRows: options.countRows,
    })

    const isExternalTable = isExternalTableID(options.tableId)
    options.query = dataFilters.cleanupQuery(options.query || {})
    options.query = dataFilters.fixupFilterArrays(options.query)

    span?.addTags({
      cleanedQuery: options.query,
      isExternalTable,
    })

    if (
      !dataFilters.hasFilters(options.query) &&
      options.query.onEmptyFilter === EmptyFilterOption.RETURN_NONE
    ) {
      span?.addTags({ emptyQuery: true })
      return {
        rows: [],
      }
    }

    if (options.sortOrder) {
      options.sortOrder = options.sortOrder.toLowerCase() as SortOrder
    }

    const table = await sdk.tables.getTable(options.tableId)
    options = searchInputMapping(table, options)

    if (options.query) {
      const tableFields = Object.keys(table.schema).filter(
        f => table.schema[f].visible !== false
      )

      const queriableFields = await getQueryableFields(
        options.fields?.filter(f => tableFields.includes(f)) ?? tableFields,
        table
      )
      options.query = removeInvalidFilters(options.query, queriableFields)
    }

    let result: SearchResponse<Row>
    if (isExternalTable) {
      span?.addTags({ searchType: "external" })
      result = await external.search(options, table)
    } else if (await features.flags.isEnabled("SQS")) {
      span?.addTags({ searchType: "sqs" })
      result = await internal.sqs.search(options, table)
    } else {
      span?.addTags({ searchType: "lucene" })
      result = await internal.lucene.search(options, table)
    }

    span?.addTags({
      foundRows: result.rows.length,
      totalRows: result.totalRows,
    })

    return result
  })
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

export async function fetchLegacyView(
  viewName: string,
  params: ViewParams
): Promise<Row[]> {
  return internal.fetchLegacyView(viewName, params)
}

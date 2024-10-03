import {
  EmptyFilterOption,
  LegacyFilter,
  LogicalOperator,
  Row,
  RowSearchParams,
  SearchFilterKey,
  SearchResponse,
  SortOrder,
  Table,
  ViewV2,
} from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import * as internal from "./search/internal"
import * as external from "./search/external"
import { ExportRowsParams, ExportRowsResult } from "./search/types"
import { dataFilters } from "@budibase/shared-core"
import sdk from "../../index"
import { searchInputMapping } from "./search/utils"
import { db, features } from "@budibase/backend-core"
import tracer from "dd-trace"
import { getQueryableFields, removeInvalidFilters } from "./queryUtils"
import { enrichSearchContext } from "../../../api/controllers/row/utils"

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
  options: RowSearchParams,
  context?: Record<string, any>
): Promise<SearchResponse<Row>> {
  return await tracer.trace("search", async span => {
    span?.addTags({
      tableId: options.tableId,
      viewId: options.viewId,
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

    let source: Table | ViewV2
    let table: Table
    if (options.viewId) {
      source = await sdk.views.get(options.viewId)
      table = await sdk.views.getTable(source)
    } else if (options.tableId) {
      source = await sdk.tables.getTable(options.tableId)
      table = source
    } else {
      throw new Error(`Must supply either a view ID or a table ID`)
    }

    const isExternalTable = isExternalTableID(table._id!)

    if (options.query) {
      const visibleFields = (
        options.fields || Object.keys(table.schema)
      ).filter(field => table.schema[field]?.visible !== false)

      const queryableFields = await getQueryableFields(table, visibleFields)
      options.query = removeInvalidFilters(options.query, queryableFields)
    } else {
      options.query = {}
    }

    // need to make sure filters in correct shape before checking for view
    options = searchInputMapping(table, options)

    if (options.viewId) {
      // Delete extraneous search params that cannot be overridden
      delete options.query.onEmptyFilter

      const view = source as ViewV2
      // Enrich saved query with ephemeral query params.
      // We prevent searching on any fields that are saved as part of the query, as
      // that could let users find rows they should not be allowed to access.
      let viewQuery = dataFilters.buildQueryLegacy(view.query) || {}
      delete viewQuery?.onEmptyFilter

      const sqsEnabled = await features.flags.isEnabled("SQS")
      const supportsLogicalOperators =
        isExternalTableID(view.tableId) || sqsEnabled
      if (!supportsLogicalOperators) {
        // In the unlikely event that a Grouped Filter is in a non-SQS environment
        // It needs to be ignored entirely
        let queryFilters: LegacyFilter[] = Array.isArray(view.query)
          ? view.query
          : []

        delete options.query.onEmptyFilter

        // Extract existing fields
        const existingFields =
          queryFilters
            ?.filter(filter => filter.field)
            .map(filter => db.removeKeyNumbering(filter.field)) || []

        viewQuery ??= {}
        // Carry over filters for unused fields
        Object.keys(options.query).forEach(key => {
          const operator = key as Exclude<SearchFilterKey, LogicalOperator>
          Object.keys(options.query[operator] || {}).forEach(field => {
            if (!existingFields.includes(db.removeKeyNumbering(field))) {
              viewQuery![operator]![field] = options.query[operator]![field]
            }
          })
        })
        options.query = viewQuery
      } else {
        const conditions = viewQuery ? [viewQuery] : []
        options.query = {
          $and: {
            conditions: [...conditions, options.query],
          },
        }
        if (viewQuery.onEmptyFilter) {
          options.query.onEmptyFilter = viewQuery.onEmptyFilter
        }
      }
    }

    if (context) {
      options.query = await enrichSearchContext(options.query, context)
    }

    options.query = dataFilters.cleanupQuery(options.query)
    options.query = dataFilters.fixupFilterArrays(options.query)

    span.addTags({
      cleanedQuery: options.query,
    })

    if (
      !dataFilters.hasFilters(options.query) &&
      options.query.onEmptyFilter === EmptyFilterOption.RETURN_NONE
    ) {
      span.addTags({ emptyQuery: true })
      return {
        rows: [],
      }
    }

    if (options.sortOrder) {
      options.sortOrder = options.sortOrder.toLowerCase() as SortOrder
    }

    let result: SearchResponse<Row>
    if (isExternalTable) {
      span?.addTags({ searchType: "external" })
      result = await external.search(options, source)
    } else if (await features.flags.isEnabled("SQS")) {
      span?.addTags({ searchType: "sqs" })
      result = await internal.sqs.search(options, source)
    } else {
      span?.addTags({ searchType: "lucene" })
      result = await internal.lucene.search(options, source)
    }

    span.addTags({
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

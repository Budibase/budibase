import {
  IncludeRelationship,
  Operation,
  PaginationJson,
  Row,
  RowSearchParams,
  SearchFilters,
  SearchResponse,
  SortJson,
  SortOrder,
  Table,
  ViewV2,
} from "@budibase/types"
import * as exporters from "../../../../api/controllers/view/exporters"
import { handleRequest } from "../../../../api/controllers/row/external"
import {
  breakExternalTableId,
  breakRowIdField,
} from "../../../../integrations/utils"
import { utils, PROTECTED_EXTERNAL_COLUMNS } from "@budibase/shared-core"
import { ExportRowsParams, ExportRowsResult } from "./types"
import { HTTPError } from "@budibase/backend-core"
import pick from "lodash/pick"
import { outputProcessing } from "../../../../utilities/rowProcessor"
import sdk from "../../../"
import { isSearchingByRowID } from "./utils"

function getPaginationAndLimitParameters(
  filters: SearchFilters,
  paginate: boolean | undefined,
  bookmark: number | undefined,
  limit: number | undefined
): PaginationJson | undefined {
  let paginateObj: PaginationJson | undefined

  // only try set limits/pagination if we aren't doing a row ID search
  if (isSearchingByRowID(filters)) {
    return
  }

  if (paginate && !limit) {
    throw new Error("Cannot paginate query without a limit")
  }

  if (paginate && limit) {
    paginateObj = {
      // add one so we can track if there is another page
      limit: limit + 1,
    }
    if (bookmark) {
      paginateObj.offset = bookmark
    }
  } else if (limit) {
    paginateObj = {
      limit: limit,
    }
  }

  return paginateObj
}

export async function search(
  options: RowSearchParams,
  source: Table | ViewV2
): Promise<SearchResponse<Row>> {
  const { countRows, paginate, query, ...params } = options
  const { limit } = params
  let bookmark =
    (params.bookmark && parseInt(params.bookmark as string)) || undefined
  if (paginate && !bookmark) {
    bookmark = 0
  }

  let paginateObj = getPaginationAndLimitParameters(
    query,
    paginate,
    bookmark,
    limit
  )

  let sort: SortJson | undefined
  if (params.sort) {
    const direction =
      params.sortOrder === "descending"
        ? SortOrder.DESCENDING
        : SortOrder.ASCENDING
    sort = {
      [params.sort]: { direction },
    }
  }

  // Make sure oneOf _id queries decode the Row IDs
  if (query?.oneOf?._id) {
    const rowIds = query.oneOf._id
    query.oneOf._id = rowIds.map((row: string) => {
      const ids = breakRowIdField(row)
      return ids[0]
    })
  }

  try {
    const parameters = {
      filters: query,
      sort,
      paginate: paginateObj as PaginationJson,
      includeSqlRelationships: IncludeRelationship.INCLUDE,
    }
    const [{ rows, rawResponseSize }, totalRows] = await Promise.all([
      handleRequest(Operation.READ, source, parameters),
      countRows
        ? handleRequest(Operation.COUNT, source, parameters)
        : Promise.resolve(undefined),
    ])

    let processed = await outputProcessing(source, rows, {
      preserveLinks: true,
      squash: true,
    })

    let hasNextPage = false
    // if the raw rows is greater than the limit then we likely need to paginate
    if (paginate && limit && rawResponseSize > limit) {
      hasNextPage = true
      // processed rows has merged relationships down, this might not be more than limit
      if (processed.length > limit) {
        processed.pop()
      }
    }

    const visibleFields =
      options.fields ||
      Object.keys(source.schema || {}).filter(
        key => source.schema?.[key].visible !== false
      )
    const allowedFields = [...visibleFields, ...PROTECTED_EXTERNAL_COLUMNS]
    processed = processed.map((r: any) => pick(r, allowedFields))

    // need wrapper object for bookmarks etc when paginating
    const response: SearchResponse<Row> = { rows: processed, hasNextPage }
    if (hasNextPage && bookmark != null) {
      response.bookmark = bookmark + processed.length
    }
    if (totalRows != null) {
      response.totalRows = totalRows
    }
    if (paginate && !hasNextPage) {
      response.hasNextPage = false
    }
    return response
  } catch (err: any) {
    if (err.message && err.message.includes("does not exist")) {
      throw new Error(
        `Table updated externally, please re-fetch - ${err.message}`,
        { cause: err }
      )
    } else {
      throw err
    }
  }
}

export async function exportRows(
  options: ExportRowsParams
): Promise<ExportRowsResult> {
  const {
    tableId,
    format,
    columns,
    rowIds,
    query,
    sort,
    sortOrder,
    delimiter,
    customHeaders,
  } = options

  if (!tableId) {
    throw new HTTPError("No table ID for search provided.", 400)
  }
  const { datasourceId, tableName } = breakExternalTableId(tableId)

  let requestQuery: SearchFilters = {}
  if (rowIds?.length) {
    requestQuery = {
      oneOf: {
        _id: rowIds.map((row: string) => {
          const ids = breakRowIdField(row)
          if (ids.length > 1) {
            return ids
          }
          return ids[0]
        }),
      },
    }
  } else {
    requestQuery = query || {}
  }

  const datasource = await sdk.datasources.get(datasourceId)
  const table = await sdk.tables.getTable(tableId)
  if (!datasource || !datasource.entities) {
    throw new HTTPError("Datasource has not been configured for plus API.", 400)
  }

  let result = await search(
    { tableId: table._id!, query: requestQuery, sort, sortOrder },
    table
  )
  let rows: Row[] = []
  let headers

  // Filter data to only specified columns if required
  if (columns && columns.length) {
    for (let i = 0; i < result.rows.length; i++) {
      rows[i] = {}
      for (let column of columns) {
        rows[i][column] = result.rows[i][column]
      }
    }
    headers = columns
  } else {
    rows = result.rows
  }

  const schema = datasource.entities[tableName].schema
  let exportRows = sdk.rows.utils.cleanExportRows(
    rows,
    schema,
    format,
    columns,
    customHeaders
  )

  let content: string
  switch (format) {
    case exporters.Format.CSV:
      content = exporters.csv(
        headers ?? Object.keys(schema),
        exportRows,
        delimiter,
        customHeaders
      )
      break
    case exporters.Format.JSON:
      content = exporters.json(exportRows)
      break
    case exporters.Format.JSON_WITH_SCHEMA:
      content = exporters.jsonWithSchema(schema, exportRows)
      break
    default:
      throw utils.unreachable(format)
  }

  const fileName = `export.${format}`
  return {
    fileName,
    content,
  }
}

export async function fetch(tableId: string): Promise<Row[]> {
  const table = await sdk.tables.getTable(tableId)
  const response = await handleRequest(Operation.READ, table, {
    includeSqlRelationships: IncludeRelationship.INCLUDE,
  })
  return await outputProcessing(table, response.rows, {
    preserveLinks: true,
    squash: true,
  })
}

export async function fetchRaw(tableId: string): Promise<Row[]> {
  const table = await sdk.tables.getTable(tableId)
  const response = await handleRequest(Operation.READ, table, {
    includeSqlRelationships: IncludeRelationship.INCLUDE,
  })
  return response.rows
}

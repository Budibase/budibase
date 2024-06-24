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
} from "@budibase/types"
import * as exporters from "../../../../api/controllers/view/exporters"
import { handleRequest } from "../../../../api/controllers/row/external"
import {
  breakExternalTableId,
  breakRowIdField,
} from "../../../../integrations/utils"
import { utils } from "@budibase/shared-core"
import { ExportRowsParams, ExportRowsResult } from "./types"
import { db, HTTPError } from "@budibase/backend-core"
import pick from "lodash/pick"
import { outputProcessing } from "../../../../utilities/rowProcessor"
import sdk from "../../../"

export async function search(
  options: RowSearchParams,
  table: Table
): Promise<SearchResponse<Row>> {
  const { tableId } = options
  const { countRows, paginate, query, ...params } = options
  const { limit } = params
  let bookmark =
    (params.bookmark && parseInt(params.bookmark as string)) || undefined
  if (paginate && !bookmark) {
    bookmark = 0
  }
  let paginateObj: PaginationJson | undefined

  if (paginate && !limit) {
    throw new Error("Cannot paginate query without a limit")
  }

  if (paginate && limit) {
    paginateObj = {
      // add one so we can track if there is another page
      limit: limit + 1,
    }
    if (bookmark) {
      paginateObj.offset = limit * bookmark
    }
  } else if (params && limit) {
    paginateObj = {
      limit: limit,
    }
  }
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
    const queries: Promise<Row[] | number>[] = []
    queries.push(handleRequest(Operation.READ, tableId, parameters))
    if (countRows) {
      queries.push(handleRequest(Operation.COUNT, tableId, parameters))
    }
    const responses = await Promise.all(queries)
    let rows = responses[0] as Row[]
    const totalRows =
      responses.length > 1 ? (responses[1] as number) : undefined

    let hasNextPage = false
    // remove the extra row if it's there
    if (paginate && limit && rows.length > limit) {
      rows.pop()
      hasNextPage = true
    }

    if (options.fields) {
      const fields = [...options.fields, ...db.CONSTANT_EXTERNAL_ROW_COLS]
      rows = rows.map((r: any) => pick(r, fields))
    }

    rows = await outputProcessing<Row[]>(table, rows, {
      preserveLinks: true,
      squash: true,
    })

    // need wrapper object for bookmarks etc when paginating
    const response: SearchResponse<Row> = { rows, hasNextPage }
    if (hasNextPage && bookmark != null) {
      response.bookmark = bookmark + 1
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
        `Table updated externally, please re-fetch - ${err.message}`
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
            throw new HTTPError(
              "Export data does not support composite keys.",
              400
            )
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
    { tableId, query: requestQuery, sort, sortOrder },
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
  const response = await handleRequest<Operation.READ>(
    Operation.READ,
    tableId,
    {
      includeSqlRelationships: IncludeRelationship.INCLUDE,
    }
  )
  const table = await sdk.tables.getTable(tableId)
  return await outputProcessing<Row[]>(table, response, {
    preserveLinks: true,
    squash: true,
  })
}

export async function fetchRaw(tableId: string): Promise<Row[]> {
  return await handleRequest<Operation.READ>(Operation.READ, tableId, {
    includeSqlRelationships: IncludeRelationship.INCLUDE,
  })
}

export async function fetchView(viewName: string) {
  // there are no views in external datasources, shouldn't ever be called
  // for now just fetch
  const split = viewName.split("all_")
  const tableId = split[1] ? split[1] : split[0]
  return fetch(tableId)
}

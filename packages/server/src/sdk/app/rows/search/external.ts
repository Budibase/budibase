import {
  SortJson,
  SortDirection,
  Operation,
  PaginationJson,
  IncludeRelationship,
  Row,
  SearchFilters,
  SearchParams,
} from "@budibase/types"
import * as exporters from "../../../../api/controllers/view/exporters"
import sdk from "../../../../sdk"
import { handleRequest } from "../../../../api/controllers/row/external"
import { breakExternalTableId } from "../../../../integrations/utils"
import { cleanExportRows } from "../utils"
import { utils } from "@budibase/shared-core"
import { ExportRowsParams, ExportRowsResult } from "../search"
import { HTTPError, db } from "@budibase/backend-core"
import { searchInputMapping } from "./utils"
import pick from "lodash/pick"
import { outputProcessing } from "../../../../utilities/rowProcessor"

export async function search(options: SearchParams) {
  const { tableId } = options
  const { paginate, query, ...params } = options
  const { limit } = params
  let bookmark = (params.bookmark && parseInt(params.bookmark)) || null
  if (paginate && !bookmark) {
    bookmark = 1
  }
  let paginateObj = {}

  if (paginate) {
    paginateObj = {
      // add one so we can track if there is another page
      limit: limit,
      page: bookmark,
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
        ? SortDirection.DESCENDING
        : SortDirection.ASCENDING
    sort = {
      [params.sort]: { direction },
    }
  }

  try {
    const table = await sdk.tables.getTable(tableId)
    options = searchInputMapping(table, options)
    let rows = (await handleRequest(Operation.READ, tableId, {
      filters: query,
      sort,
      paginate: paginateObj as PaginationJson,
      includeSqlRelationships: IncludeRelationship.INCLUDE,
    })) as Row[]
    let hasNextPage = false
    if (paginate && rows.length === limit) {
      const nextRows = (await handleRequest(Operation.READ, tableId, {
        filters: query,
        sort,
        paginate: {
          limit: 1,
          page: bookmark! * limit + 1,
        },
        includeSqlRelationships: IncludeRelationship.INCLUDE,
      })) as Row[]
      hasNextPage = nextRows.length > 0
    }

    if (options.fields) {
      const fields = [...options.fields, ...db.CONSTANT_EXTERNAL_ROW_COLS]
      rows = rows.map((r: any) => pick(r, fields))
    }

    rows = await outputProcessing(table, rows, { preserveLinks: true })

    // need wrapper object for bookmarks etc when paginating
    return { rows, hasNextPage, bookmark: bookmark && bookmark + 1 }
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
  const { tableId, format, columns, rowIds } = options
  const { datasourceId, tableName } = breakExternalTableId(tableId)

  let query: SearchFilters = {}
  if (rowIds?.length) {
    query = {
      oneOf: {
        _id: rowIds.map((row: string) => {
          const ids = JSON.parse(
            decodeURI(row).replace(/'/g, `"`).replace(/%2C/g, ",")
          )
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
  }

  const datasource = await sdk.datasources.get(datasourceId!)
  if (!datasource || !datasource.entities) {
    throw new HTTPError("Datasource has not been configured for plus API.", 400)
  }

  let result = await search({ tableId, query })
  let rows: Row[] = []

  // Filter data to only specified columns if required

  if (columns && columns.length) {
    for (let i = 0; i < result.rows.length; i++) {
      rows[i] = {}
      for (let column of columns) {
        rows[i][column] = result.rows[i][column]
      }
    }
  } else {
    rows = result.rows
  }

  if (!tableName) {
    throw new HTTPError("Could not find table name.", 400)
  }
  const schema = datasource.entities[tableName].schema
  let exportRows = cleanExportRows(rows, schema, format, columns)

  let headers = Object.keys(schema)

  let content: string
  switch (format) {
    case exporters.Format.CSV:
      content = exporters.csv(headers, exportRows)
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

export async function fetch(tableId: string) {
  const response = await handleRequest(Operation.READ, tableId, {
    includeSqlRelationships: IncludeRelationship.INCLUDE,
  })
  const table = await sdk.tables.getTable(tableId)
  return await outputProcessing(table, response, { preserveLinks: true })
}

export async function fetchView(viewName: string) {
  // there are no views in external datasources, shouldn't ever be called
  // for now just fetch
  const split = viewName.split("all_")
  const tableId = split[1] ? split[1] : split[0]
  return fetch(tableId)
}

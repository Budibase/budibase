import {
  SortJson,
  SortDirection,
  Operation,
  PaginationJson,
  IncludeRelationship,
  Row,
  Ctx,
} from "@budibase/types"
import * as exporters from "../../../../api/controllers/view/exporters"
import sdk from "../../../../sdk"
import { handleRequest } from "../../../../api/controllers/row/external"
import { breakExternalTableId } from "../../../../integrations/utils"
import { cleanExportRows } from "../utils"
import { apiFileReturn } from "../../../../utilities/fileSystem"
import { utils } from "@budibase/shared-core"
import { ExportRowsParams, ExportRowsResult } from "../search"

export async function search(ctx: Ctx) {
  const tableId = ctx.params.tableId
  const { paginate, query, ...params } = ctx.request.body
  let { bookmark, limit } = params
  if (!bookmark && paginate) {
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
    const rows = (await handleRequest(Operation.READ, tableId, {
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
          page: bookmark * limit + 1,
        },
        includeSqlRelationships: IncludeRelationship.INCLUDE,
      })) as Row[]
      hasNextPage = nextRows.length > 0
    }
    // need wrapper object for bookmarks etc when paginating
    return { rows, hasNextPage, bookmark: bookmark + 1 }
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

  const datasource = await sdk.datasources.get(datasourceId!)
  if (!datasource || !datasource.entities) {
    throw ctx.throw(400, "Datasource has not been configured for plus API.")
  }

  if (rowIds?.length) {
    ctx.request.body = {
      query: {
        oneOf: {
          _id: rowIds.map((row: string) => {
            const ids = JSON.parse(
              decodeURI(row).replace(/'/g, `"`).replace(/%2C/g, ",")
            )
            if (ids.length > 1) {
              throw ctx.throw(
                400,
                "Export data does not support composite keys."
              )
            }
            return ids[0]
          }),
        },
      },
    }
  }

  let result = await search(ctx)
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
    throw ctx.throw(400, "Could not find table name.")
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
  return handleRequest(Operation.READ, tableId, {
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

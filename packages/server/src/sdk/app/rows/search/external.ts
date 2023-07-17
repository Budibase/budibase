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

export async function exportRows(ctx: Ctx) {
  const { datasourceId, tableName } = breakExternalTableId(ctx.params.tableId)
  const format = ctx.query.format as string
  const { columns } = ctx.request.body
  const datasource = await sdk.datasources.get(datasourceId!)
  if (!datasource || !datasource.entities) {
    ctx.throw(400, "Datasource has not been configured for plus API.")
  }

  if (!exporters.isFormat(format)) {
    ctx.throw(
      400,
      `Format ${format} not valid. Valid values: ${Object.values(
        exporters.Format
      )}`
    )
  }

  if (ctx.request.body.rows) {
    ctx.request.body = {
      query: {
        oneOf: {
          _id: ctx.request.body.rows.map((row: string) => {
            const ids = JSON.parse(
              decodeURI(row).replace(/'/g, `"`).replace(/%2C/g, ",")
            )
            if (ids.length > 1) {
              ctx.throw(400, "Export data does not support composite keys.")
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
    ctx.throw(400, "Could not find table name.")
  }
  let schema = datasource.entities[tableName].schema
  let exportRows = cleanExportRows(rows, schema, format, columns)

  let headers = Object.keys(schema)

  let content
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
      utils.unreachable(format)
      break
  }

  const filename = `export.${format}`

  // send down the file
  ctx.attachment(filename)
  return apiFileReturn(content)
}

export async function fetch(ctx: Ctx) {
  const tableId = ctx.params.tableId
  return handleRequest(Operation.READ, tableId, {
    includeSqlRelationships: IncludeRelationship.INCLUDE,
  })
}

export async function fetchView(ctx: Ctx) {
  // there are no views in external datasources, shouldn't ever be called
  // for now just fetch
  const split = ctx.params.viewName.split("all_")
  ctx.params.tableId = split[1] ? split[1] : split[0]
  return fetch(ctx)
}

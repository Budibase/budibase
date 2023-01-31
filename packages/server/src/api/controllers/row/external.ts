import {
  SortDirection,
  FieldTypes,
  NoEmptyFilterStrings,
} from "../../../constants"
import {
  breakExternalTableId,
  breakRowIdField,
} from "../../../integrations/utils"
import { ExternalRequest, RunConfig } from "./ExternalRequest"
import { context } from "@budibase/backend-core"
import * as exporters from "../view/exporters"
import { apiFileReturn } from "../../../utilities/fileSystem"
import {
  Operation,
  BBContext,
  Row,
  PaginationJson,
  Table,
  Datasource,
} from "@budibase/types"
import sdk from "../../../sdk"

const { cleanExportRows } = require("./utils")

export async function handleRequest(
  operation: Operation,
  tableId: string,
  opts?: RunConfig
) {
  // make sure the filters are cleaned up, no empty strings for equals, fuzzy or string
  if (opts && opts.filters) {
    for (let filterField of NoEmptyFilterStrings) {
      if (!opts.filters[filterField]) {
        continue
      }
      // @ts-ignore
      for (let [key, value] of Object.entries(opts.filters[filterField])) {
        if (!value || value === "") {
          // @ts-ignore
          delete opts.filters[filterField][key]
        }
      }
    }
  }
  return new ExternalRequest(operation, tableId, opts?.datasource).run(
    opts || {}
  )
}

export async function patch(ctx: BBContext) {
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  const id = inputs._id
  // don't save the ID to db
  delete inputs._id
  return handleRequest(Operation.UPDATE, tableId, {
    id: breakRowIdField(id),
    row: inputs,
  })
}

export async function save(ctx: BBContext) {
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  return handleRequest(Operation.CREATE, tableId, {
    row: inputs,
  })
}

export async function fetchView(ctx: BBContext) {
  // there are no views in external datasources, shouldn't ever be called
  // for now just fetch
  const split = ctx.params.viewName.split("all_")
  ctx.params.tableId = split[1] ? split[1] : split[0]
  return fetch(ctx)
}

export async function fetch(ctx: BBContext) {
  const tableId = ctx.params.tableId
  return handleRequest(Operation.READ, tableId)
}

export async function find(ctx: BBContext) {
  const id = ctx.params.rowId
  const tableId = ctx.params.tableId
  const response = (await handleRequest(Operation.READ, tableId, {
    id: breakRowIdField(id),
  })) as Row[]
  return response ? response[0] : response
}

export async function destroy(ctx: BBContext) {
  const tableId = ctx.params.tableId
  const id = ctx.request.body._id
  const { row } = (await handleRequest(Operation.DELETE, tableId, {
    id: breakRowIdField(id),
  })) as { row: Row }
  return { response: { ok: true }, row }
}

export async function bulkDestroy(ctx: BBContext) {
  const { rows } = ctx.request.body
  const tableId = ctx.params.tableId
  let promises: Promise<Row[] | { row: Row; table: Table }>[] = []
  for (let row of rows) {
    promises.push(
      handleRequest(Operation.DELETE, tableId, {
        id: breakRowIdField(row._id),
      })
    )
  }
  const responses = (await Promise.all(promises)) as { row: Row }[]
  return { response: { ok: true }, rows: responses.map(resp => resp.row) }
}

export async function search(ctx: BBContext) {
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
  let sort
  if (params.sort) {
    const direction =
      params.sortOrder === "descending"
        ? SortDirection.DESCENDING
        : SortDirection.ASCENDING
    sort = {
      [params.sort]: direction,
    }
  }
  try {
    const rows = (await handleRequest(Operation.READ, tableId, {
      filters: query,
      sort,
      paginate: paginateObj as PaginationJson,
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

export async function validate(ctx: BBContext) {
  // can't validate external right now - maybe in future
  return { valid: true }
}

export async function exportRows(ctx: BBContext) {
  const { datasourceId } = breakExternalTableId(ctx.params.tableId)
  const format = ctx.query.format
  const { columns } = ctx.request.body
  const datasource = await sdk.datasources.get(datasourceId!)
  if (!datasource || !datasource.entities) {
    ctx.throw(400, "Datasource has not been configured for plus API.")
  }

  if (ctx.request.body.rows) {
    ctx.request.body = {
      query: {
        oneOf: {
          _id: ctx.request.body.rows.map(
            (row: string) => JSON.parse(decodeURI(row))[0]
          ),
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

  // @ts-ignore
  let schema = datasource.entities[tableName].schema
  let exportRows = cleanExportRows(rows, schema, format, columns)

  let headers = Object.keys(schema)

  // @ts-ignore
  const exporter = exporters[format]
  const filename = `export.${format}`

  // send down the file
  ctx.attachment(filename)
  return apiFileReturn(exporter(headers, exportRows))
}

export async function fetchEnrichedRow(ctx: BBContext) {
  const id = ctx.params.rowId
  const tableId = ctx.params.tableId
  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const datasource: Datasource = await sdk.datasources.get(datasourceId!)
  if (!tableName) {
    ctx.throw(400, "Unable to find table.")
  }
  if (!datasource || !datasource.entities) {
    ctx.throw(400, "Datasource has not been configured for plus API.")
  }
  const tables = datasource.entities
  const response = (await handleRequest(Operation.READ, tableId, {
    id,
    datasource,
  })) as Row[]
  const table: Table = tables[tableName]
  const row = response[0]
  // this seems like a lot of work, but basically we need to dig deeper for the enrich
  // for a single row, there is probably a better way to do this with some smart multi-layer joins
  for (let [fieldName, field] of Object.entries(table.schema)) {
    if (
      field.type !== FieldTypes.LINK ||
      !row[fieldName] ||
      row[fieldName].length === 0
    ) {
      continue
    }
    const links = row[fieldName]
    const linkedTableId = field.tableId
    const linkedTableName = breakExternalTableId(linkedTableId).tableName!
    const linkedTable = tables[linkedTableName]
    // don't support composite keys right now
    const linkedIds = links.map((link: Row) => breakRowIdField(link._id!)[0])
    const primaryLink = linkedTable.primary?.[0] as string
    row[fieldName] = await handleRequest(Operation.READ, linkedTableId!, {
      tables,
      filters: {
        oneOf: {
          [primaryLink]: linkedIds,
        },
      },
    })
  }
  return row
}

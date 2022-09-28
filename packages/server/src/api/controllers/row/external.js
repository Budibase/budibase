const {
  DataSourceOperation,
  SortDirection,
  FieldTypes,
  NoEmptyFilterStrings,
} = require("../../../constants")
const {
  breakExternalTableId,
  breakRowIdField,
} = require("../../../integrations/utils")
const ExternalRequest = require("./ExternalRequest")
const { getAppDB } = require("@budibase/backend-core/context")
const exporters = require("../view/exporters")
const { apiFileReturn } = require("../../../utilities/fileSystem")

async function handleRequest(operation, tableId, opts = {}) {
  // make sure the filters are cleaned up, no empty strings for equals, fuzzy or string
  if (opts && opts.filters) {
    for (let filterField of NoEmptyFilterStrings) {
      if (!opts.filters[filterField]) {
        continue
      }
      for (let [key, value] of Object.entries(opts.filters[filterField])) {
        if (!value || value === "") {
          delete opts.filters[filterField][key]
        }
      }
    }
  }
  return new ExternalRequest(operation, tableId, opts.datasource).run(opts)
}

exports.handleRequest = handleRequest

exports.patch = async ctx => {
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  const id = inputs._id
  // don't save the ID to db
  delete inputs._id
  return handleRequest(DataSourceOperation.UPDATE, tableId, {
    id: breakRowIdField(id),
    row: inputs,
  })
}

exports.save = async ctx => {
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  return handleRequest(DataSourceOperation.CREATE, tableId, {
    row: inputs,
  })
}

exports.fetchView = async ctx => {
  // there are no views in external datasources, shouldn't ever be called
  // for now just fetch
  const split = ctx.params.viewName.split("all_")
  ctx.params.tableId = split[1] ? split[1] : split[0]
  return exports.fetch(ctx)
}

exports.fetch = async ctx => {
  const tableId = ctx.params.tableId
  return handleRequest(DataSourceOperation.READ, tableId)
}

exports.find = async ctx => {
  const id = ctx.params.rowId
  const tableId = ctx.params.tableId
  const response = await handleRequest(DataSourceOperation.READ, tableId, {
    id: breakRowIdField(id),
  })
  return response ? response[0] : response
}

exports.destroy = async ctx => {
  const tableId = ctx.params.tableId
  const id = ctx.request.body._id
  const { row } = await handleRequest(DataSourceOperation.DELETE, tableId, {
    id: breakRowIdField(id),
  })
  return { response: { ok: true }, row }
}

exports.bulkDestroy = async ctx => {
  const { rows } = ctx.request.body
  const tableId = ctx.params.tableId
  let promises = []
  for (let row of rows) {
    promises.push(
      handleRequest(DataSourceOperation.DELETE, tableId, {
        id: breakRowIdField(row._id),
      })
    )
  }
  const responses = await Promise.all(promises)
  return { response: { ok: true }, rows: responses.map(resp => resp.row) }
}

exports.search = async ctx => {
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
    const rows = await handleRequest(DataSourceOperation.READ, tableId, {
      filters: query,
      sort,
      paginate: paginateObj,
    })
    let hasNextPage = false
    if (paginate && rows.length === limit) {
      const nextRows = await handleRequest(DataSourceOperation.READ, tableId, {
        filters: query,
        sort,
        paginate: {
          limit: 1,
          page: bookmark * limit + 1,
        },
      })
      hasNextPage = nextRows.length > 0
    }
    // need wrapper object for bookmarks etc when paginating
    return { rows, hasNextPage, bookmark: bookmark + 1 }
  } catch (err) {
    if (err.message && err.message.includes("does not exist")) {
      throw new Error(
        `Table updated externally, please re-fetch - ${err.message}`
      )
    } else {
      throw err
    }
  }
}

exports.validate = async () => {
  // can't validate external right now - maybe in future
  return { valid: true }
}

exports.exportRows = async ctx => {
  const { datasourceId } = breakExternalTableId(ctx.params.tableId)
  const db = getAppDB()
  const format = ctx.query.format
  const { columns } = ctx.request.body
  const datasource = await db.get(datasourceId)
  if (!datasource || !datasource.entities) {
    ctx.throw(400, "Datasource has not been configured for plus API.")
  }
  ctx.request.body = {
    query: {
      oneOf: {
        _id: ctx.request.body.rows.map(row => JSON.parse(decodeURI(row))[0]),
      },
    },
  }

  let result = await exports.search(ctx)
  let rows = []

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

  let headers = Object.keys(rows[0])
  const exporter = exporters[format]
  const filename = `export.${format}`

  // send down the file
  ctx.attachment(filename)
  return apiFileReturn(exporter(headers, rows))
}

exports.fetchEnrichedRow = async ctx => {
  const id = ctx.params.rowId
  const tableId = ctx.params.tableId
  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const db = getAppDB()
  const datasource = await db.get(datasourceId)
  if (!datasource || !datasource.entities) {
    ctx.throw(400, "Datasource has not been configured for plus API.")
  }
  const tables = datasource.entities
  const response = await handleRequest(DataSourceOperation.READ, tableId, {
    id,
    datasource,
  })
  const table = tables[tableName]
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
    const linkedTable = tables[breakExternalTableId(linkedTableId).tableName]
    // don't support composite keys right now
    const linkedIds = links.map(link => breakRowIdField(link._id)[0])
    row[fieldName] = await handleRequest(
      DataSourceOperation.READ,
      linkedTableId,
      {
        tables,
        filters: {
          oneOf: {
            [linkedTable.primary]: linkedIds,
          },
        },
      }
    )
  }
  return row
}

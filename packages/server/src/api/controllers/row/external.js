const {
  DataSourceOperation,
  SortDirection,
  FieldTypes,
} = require("../../../constants")
const {
  breakExternalTableId,
  breakRowIdField,
} = require("../../../integrations/utils")
const ExternalRequest = require("./ExternalRequest")
const CouchDB = require("../../../db")

async function handleRequest(appId, operation, tableId, opts = {}) {
  return new ExternalRequest(appId, operation, tableId, opts.datasource).run(
    opts
  )
}

exports.patch = async ctx => {
  const appId = ctx.appId
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  const id = breakRowIdField(inputs._id)
  // don't save the ID to db
  delete inputs._id
  return handleRequest(appId, DataSourceOperation.UPDATE, tableId, {
    id,
    row: inputs,
  })
}

exports.save = async ctx => {
  const appId = ctx.appId
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  return handleRequest(appId, DataSourceOperation.CREATE, tableId, {
    row: inputs,
  })
}

exports.fetchView = async ctx => {
  // there are no views in external data sources, shouldn't ever be called
  // for now just fetch
  ctx.params.tableId = ctx.params.viewName.split("all_")[1]
  return exports.fetch(ctx)
}

exports.fetch = async ctx => {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
  return handleRequest(appId, DataSourceOperation.READ, tableId)
}

exports.find = async ctx => {
  const appId = ctx.appId
  const id = ctx.params.rowId
  const tableId = ctx.params.tableId
  const response = await handleRequest(
    appId,
    DataSourceOperation.READ,
    tableId,
    {
      id,
    }
  )
  return response ? response[0] : response
}

exports.destroy = async ctx => {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
  const id = ctx.request.body._id
  const { row } = await handleRequest(
    appId,
    DataSourceOperation.DELETE,
    tableId,
    {
      id,
    }
  )
  return { response: { ok: true }, row }
}

exports.bulkDestroy = async ctx => {
  const appId = ctx.appId
  const { rows } = ctx.request.body
  const tableId = ctx.params.tableId
  let promises = []
  for (let row of rows) {
    promises.push(
      handleRequest(appId, DataSourceOperation.DELETE, tableId, {
        id: breakRowIdField(row._id),
      })
    )
  }
  const responses = await Promise.all(promises)
  return { response: { ok: true }, rows: responses.map(resp => resp.row) }
}

exports.search = async ctx => {
  const appId = ctx.appId
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
  const rows = await handleRequest(appId, DataSourceOperation.READ, tableId, {
    filters: query,
    sort,
    paginate: paginateObj,
  })
  let hasNextPage = false
  if (paginate && rows.length === limit) {
    const nextRows = await handleRequest(
      appId,
      DataSourceOperation.READ,
      tableId,
      {
        filters: query,
        sort,
        paginate: {
          limit: 1,
          page: bookmark * limit + 1,
        },
      }
    )
    hasNextPage = nextRows.length > 0
  }
  // need wrapper object for bookmarks etc when paginating
  return { rows, hasNextPage, bookmark: bookmark + 1 }
}

exports.validate = async () => {
  // can't validate external right now - maybe in future
  return { valid: true }
}

exports.fetchEnrichedRow = async ctx => {
  const appId = ctx.appId
  const id = ctx.params.rowId
  const tableId = ctx.params.tableId
  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const db = new CouchDB(appId)
  const datasource = await db.get(datasourceId)
  if (!datasource || !datasource.entities) {
    ctx.throw(400, "Datasource has not been configured for plus API.")
  }
  const tables = datasource.entities
  const response = await handleRequest(
    appId,
    DataSourceOperation.READ,
    tableId,
    {
      id,
      datasource,
    }
  )
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
      appId,
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

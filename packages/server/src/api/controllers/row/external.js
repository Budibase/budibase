const CouchDB = require("../../../db")
const { makeExternalQuery } = require("./utils")
const { DataSourceOperation, SortDirection } = require("../../../constants")

async function getTable(appId, datasourceId, tableName) {
  const db = new CouchDB(appId)
  const datasource = await db.get(datasourceId)
  if (!datasource || !datasource.entities) {
    throw "Datasource is not configured fully."
  }
  return Object.values(datasource.entities).find(
    entity => entity.name === tableName
  )
}

function inputProcessing(row, table) {
  if (!row) {
    return row
  }
  let newRow = {}
  for (let key of Object.keys(table.schema)) {
    // currently excludes empty strings
    if (row[key]) {
      newRow[key] = row[key]
    }
  }
  return newRow
}

function outputProcessing(rows, table) {
  // if no rows this is what is returned? Might be PG only
  if (rows[0].read === true) {
    return []
  }
  const primary = table.primary
  for (let row of rows) {
    // build id array
    let idParts = []
    for (let field of primary) {
      idParts.push(row[field])
    }
    row._id = idParts
  }
  return rows
}

function buildIDFilter(id, table) {
  if (!id || !table) {
    return null
  }
  // if used as URL parameter it will have been joined
  if (typeof id === "string") {
    id = id.split(",")
  }
  const primary = table.primary
  const equal = {}
  for (let field of primary) {
    // work through the ID and get the parts
    equal[field] = id.shift()
  }
  return {
    equal,
  }
}

async function handleRequest(
  appId,
  operation,
  tableId,
  { id, row, filters, sort, paginate } = {}
) {
  const parts = tableId.split("_")
  let tableName = parts.pop()
  let datasourceId = parts.join("_")
  const table = await getTable(appId, datasourceId, tableName)
  if (!table) {
    throw `Unable to process query, table "${tableName}" not defined.`
  }
  // clean up row on ingress using schema
  row = inputProcessing(row, table)
  // try and build an id filter if required
  let idFilters = buildIDFilter(id, table)
  if (operation === DataSourceOperation.DELETE && Object.keys(idFilters).length === 0) {
    throw "Deletion must be filtered in someway"
  }
  let json = {
    endpoint: {
      datasourceId,
      entityId: tableName,
      operation,
    },
    resource: {
      // not specifying any fields means "*"
      fields: [],
    },
    filters: idFilters != null ? idFilters : filters,
    sort,
    paginate,
    body: row,
  }
  // can't really use response right now
  const response = await makeExternalQuery(appId, json)
  // we searched for rows in someway
  if (operation === DataSourceOperation.READ && Array.isArray(response)) {
    return outputProcessing(response, table)
  }
  // append tableId back onto row if it exists
  if (row) {
    row.tableId = table._id
  }
  return { row, table }
}

exports.patch = async ctx => {
  const appId = ctx.appId
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  const id = inputs._id
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
  if (inputs._id) {
    return exports.patch(ctx)
  }
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
  return handleRequest(appId, DataSourceOperation.READ, tableId, {
    id,
  })
}

exports.destroy = async ctx => {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
  return handleRequest(appId, DataSourceOperation.DELETE, tableId, {
    id: ctx.request.body._id,
  })
}

exports.bulkDestroy = async ctx => {
  const appId = ctx.appId
  const { rows } = ctx.request.body
  const tableId = ctx.params.tableId
  // TODO: this can probably be optimised to a single SQL statement in the future
  let promises = []
  for (let row of rows) {
    promises.push(
      handleRequest(appId, DataSourceOperation.DELETE, tableId, {
        id: row._id,
      })
    )
  }
  await Promise.all(promises)
  return { response: { ok: true }, rows }
}

exports.search = async ctx => {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
  const { paginate, query, ...params } = ctx.request.body
  let paginateObj = {}
  if (paginate) {
    paginateObj = {
      limit: params.limit,
      // todo: need to handle bookmarks
      page: params.bookmark,
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
  return handleRequest(appId, DataSourceOperation.READ, tableId, {
    filters: query,
    sort,
    paginate: paginateObj,
  })
}

exports.validate = async ctx => {
  // can't validate external right now - maybe in future
  return { valid: true }
}

exports.fetchEnrichedRow = async ctx => {
  // TODO: How does this work
  throw "Not Implemented"
}

const { makeExternalQuery } = require("./utils")
const { DataSourceOperation, SortDirection } = require("../../../constants")
const { getExternalTable } = require("../table/utils")
const {
  breakExternalTableId,
  generateRowIdField,
  breakRowIdField,
} = require("../../../integrations/utils")
const { cloneDeep } = require("lodash/fp")

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

function generateIdForRow(row, table) {
  if (!row) {
    return
  }
  const primary = table.primary
  // build id array
  let idParts = []
  for (let field of primary) {
    idParts.push(row[field])
  }
  return generateRowIdField(idParts)
}

function outputProcessing(rows, table) {
  // if no rows this is what is returned? Might be PG only
  if (rows[0].read === true) {
    return []
  }
  for (let row of rows) {
    row._id = generateIdForRow(row, table)
    row.tableId = table._id
    row._rev = "rev"
  }
  return rows
}

function buildFilters(id, filters, table) {
  const primary = table.primary
  // if passed in array need to copy for shifting etc
  let idCopy = cloneDeep(id)
  if (filters) {
    // need to map over the filters and make sure the _id field isn't present
    for (let filter of Object.values(filters)) {
      if (filter._id) {
        const parts = breakRowIdField(filter._id)
        for (let field of primary) {
          filter[field] = parts.shift()
        }
      }
      // make sure this field doesn't exist on any filter
      delete filter._id
    }
  }
  // there is no id, just use the user provided filters
  if (!idCopy || !table) {
    return filters
  }
  // if used as URL parameter it will have been joined
  if (typeof idCopy === "string") {
    idCopy = breakRowIdField(idCopy)
  }
  const equal = {}
  for (let field of primary) {
    // work through the ID and get the parts
    equal[field] = idCopy.shift()
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
  let { datasourceId, tableName } = breakExternalTableId(tableId)
  const table = await getExternalTable(appId, datasourceId, tableName)
  if (!table) {
    throw `Unable to process query, table "${tableName}" not defined.`
  }
  // clean up row on ingress using schema
  filters = buildFilters(id, filters, table)
  row = inputProcessing(row, table)
  if (
    operation === DataSourceOperation.DELETE &&
    (filters == null || Object.keys(filters).length === 0)
  ) {
    throw "Deletion must be filtered"
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
    filters,
    sort,
    paginate,
    body: row,
    // pass an id filter into extra, purely for mysql/returning
    extra: {
      idFilter: buildFilters(id || generateIdForRow(row, table), {}, table),
    }
  }
  // can't really use response right now
  const response = await makeExternalQuery(appId, json)
  // we searched for rows in someway
  if (operation === DataSourceOperation.READ && Array.isArray(response)) {
    return outputProcessing(response, table)
  } else {
    row = outputProcessing(response, table)[0]
    return { row, table }
  }
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
  return handleRequest(appId, DataSourceOperation.READ, tableId, {
    id,
  })
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

exports.fetchEnrichedRow = async () => {
  // TODO: How does this work
  throw "Not Implemented"
}

const CouchDB = require("../../../db")
const { makeExternalQuery } = require("./utils")
const { DataSourceOperation, SortDirection } = require("../../../constants")

async function buildIDFilter(id) {
  if (!id) {
    return {}
  }
  // TODO: work out how to use the schema to get filter
  return {
    equal: {
      id: id,
    },
  }
}

async function handleRequest(
  appId,
  operation,
  tableId,
  { id, row, filters, sort, paginate }
) {
  let [datasourceId, tableName] = tableId.split("/")
  let idFilter = buildIDFilter(id)
  let json = {
    endpoint: {
      datasourceId,
      entityId: tableName,
      operation,
    },
    filters: {
      ...filters,
      ...idFilter,
    },
    sort,
    paginate,
    body: row,
  }
  return makeExternalQuery(appId, json)
}

exports.patch = async ctx => {
  const appId = ctx.appId
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  const id = inputs._id
  // don't save the ID to db
  delete inputs._id
  ctx.body = await handleRequest(appId, DataSourceOperation.UPDATE, tableId, {
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
  ctx.body = await handleRequest(appId, DataSourceOperation.CREATE, tableId, {
    row: inputs,
  })
}

exports.fetchView = async ctx => {
  // TODO: don't know what this does for external
}

exports.fetchTableRows = async ctx => {
  // TODO: this is a basic read?
}

exports.find = async ctx => {
  // TODO: single find
}

exports.destroy = async ctx => {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
  ctx.body = await handleRequest(appId, DataSourceOperation.DELETE, tableId, {
    id: ctx.request.body._id,
  })
}

exports.bulkDestroy = async ctx => {
  // TODO: iterate through rows, build a large OR filter?
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
  ctx.body = await handleRequest(appId, DataSourceOperation.READ, tableId, {
    filters: query,
    sort,
    paginate: paginateObj,
  })
}

exports.validate = async ctx => {
  // can't validate external right now - maybe in future
  ctx.body = { valid: true }
}

exports.fetchEnrichedRow = async ctx => {
  // TODO: should this join?
  const appId = ctx.appId
  ctx.body = {}
}

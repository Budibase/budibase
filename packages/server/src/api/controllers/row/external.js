const { makeExternalQuery } = require("./utils")
const { DataSourceOperation, SortDirection } = require("../../../constants")
const { getAllExternalTables } = require("../table/utils")
const {
  breakExternalTableId,
  breakRowIdField,
} = require("../../../integrations/utils")
const {
  buildRelationships,
  buildFilters,
  inputProcessing,
  outputProcessing,
  generateIdForRow,
  buildFields,
} = require("./externalUtils")
const { processObjectSync } = require("@budibase/string-templates")

async function handleRequest(
  appId,
  operation,
  tableId,
  { id, row, filters, sort, paginate } = {}
) {
  let { datasourceId, tableName } = breakExternalTableId(tableId)
  const tables = await getAllExternalTables(appId, datasourceId)
  const table = tables[tableName]
  if (!table) {
    throw `Unable to process query, table "${tableName}" not defined.`
  }
  // clean up row on ingress using schema
  filters = buildFilters(id, filters, table)
  const relationships = buildRelationships(table, tables)
  const processed = inputProcessing(row, table, tables)
  row = processed.row
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
      // have to specify the fields to avoid column overlap
      fields: buildFields(table, tables),
    },
    filters,
    sort,
    paginate,
    relationships,
    body: row,
    // pass an id filter into extra, purely for mysql/returning
    extra: {
      idFilter: buildFilters(id || generateIdForRow(row, table), {}, table),
    },
  }
  // can't really use response right now
  const response = await makeExternalQuery(appId, json)
  // handle many to many relationships now if we know the ID (could be auto increment)
  if (processed.manyRelationships) {
    const promises = []
    for (let toInsert of processed.manyRelationships) {
      const { tableName } = breakExternalTableId(toInsert.tableId)
      delete toInsert.tableId
      promises.push(
        makeExternalQuery(appId, {
          endpoint: {
            ...json.endpoint,
            entityId: processObjectSync(tableName, row),
          },
          body: toInsert,
        })
      )
    }
    await Promise.all(promises)
  }
  // we searched for rows in someway
  if (operation === DataSourceOperation.READ && Array.isArray(response)) {
    return outputProcessing(response, table, relationships, tables)
  } else {
    row = outputProcessing(response, table, relationships, tables)[0]
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

exports.fetchEnrichedRow = async () => {}

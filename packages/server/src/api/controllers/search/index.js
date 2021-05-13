const { fullSearch, paginatedSearch } = require("./utils")
const CouchDB = require("../../../db")
const { outputProcessing } = require("../../../utilities/rowProcessor")

exports.rowSearch = async ctx => {
  const appId = ctx.appId
  const { tableId } = ctx.params
  const db = new CouchDB(appId)
  const {
    bookmark,
    query,
    limit,
    sort,
    sortOrder,
    sortType,
    paginate,
  } = ctx.request.body

  let response
  if (paginate) {
    response = await paginatedSearch(
      appId,
      query,
      tableId,
      sort,
      sortOrder,
      sortType,
      limit,
      bookmark
    )
  } else {
    response = await fullSearch(
      appId,
      query,
      tableId,
      sort,
      sortOrder,
      sortType,
      limit
    )
  }

  // Enrich search results with relationships
  if (response.rows && response.rows.length) {
    const table = await db.get(tableId)
    response.rows = await outputProcessing(appId, table, response.rows)
  }

  ctx.body = response
}

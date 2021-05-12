const { QueryBuilder, buildSearchUrl, search } = require("./utils")
const CouchDB = require("../../../db")
const { outputProcessing } = require("../../../utilities/rowProcessor")

exports.rowSearch = async ctx => {
  const appId = ctx.appId
  const { tableId } = ctx.params
  const {
    bookmark,
    query,
    raw,
    limit,
    sort,
    sortOrder,
    sortType,
  } = ctx.request.body
  const db = new CouchDB(appId)

  let url
  if (query) {
    url = new QueryBuilder(
      appId,
      query,
      bookmark,
      limit,
      sort,
      sortOrder,
      sortType
    )
      .addTable(tableId)
      .complete()
  } else if (raw) {
    url = buildSearchUrl({
      appId,
      query: raw,
      bookmark,
    })
  }
  const response = await search(url)
  const table = await db.get(tableId)
  ctx.body = {
    rows: await outputProcessing(appId, table, response.rows),
    bookmark: response.bookmark,
  }
}

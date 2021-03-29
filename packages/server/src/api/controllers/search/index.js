const { QueryBuilder, buildSearchUrl, search } = require("./utils")

exports.rowSearch = async ctx => {
  // this can't be done through pouch, have to reach for trusty node-fetch
  const appId = ctx.user.appId
  const bookmark = ctx.params.bookmark
  let url
  if (ctx.params.query) {
    url = new QueryBuilder(appId, ctx.params.query, bookmark).complete()
  } else if (ctx.params.raw) {
    url = buildSearchUrl({
      appId,
      query: ctx.params.raw,
      bookmark,
    })
  }
  ctx.body = await search(url)
}

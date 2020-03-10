const StatusCodes = require("../../utilities/statusCodes")
const { getRecordKey } = require("./helpers")

module.exports = async ctx => {
  const indexkey = getRecordKey(ctx.params.appname, ctx.request.path)
  ctx.body = await ctx.instance.indexApi.listItems(indexkey, {
    rangeStartParams: ctx.request.body.rangeStartParams,
    rangeEndParams: ctx.request.body.rangeEndParams,
    searchPhrase: ctx.request.body.searchPhrase,
  })
  ctx.response.status = StatusCodes.OK
}

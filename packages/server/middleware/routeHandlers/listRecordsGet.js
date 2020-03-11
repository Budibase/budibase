const StatusCodes = require("../../utilities/statusCodes")
const { getRecordKey } = require("./helpers")

module.exports = async ctx => {
  const indexkey = getRecordKey(ctx.params.appname, ctx.request.path)
  ctx.body = await ctx.instance.indexApi.listItems(indexkey)
  ctx.response.status = StatusCodes.OK
}

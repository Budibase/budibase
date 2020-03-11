const StatusCodes = require("../../utilities/statusCodes")
const { getRecordKey } = require("./helpers")

module.exports = async ctx => {
  await ctx.instance.recordApi.delete(
    getRecordKey(ctx.params.appname, ctx.request.path)
  )
  ctx.response.status = StatusCodes.OK
}

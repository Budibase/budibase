const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  ctx.body = await ctx.instance.recordApi.save(ctx.request.body)
  ctx.response.status = StatusCodes.OK
}

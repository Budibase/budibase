const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  ctx.body = await ctx.instance.templateApi.saveApplicationHierarchy(ctx.body)
  ctx.response.status = StatusCodes.OK
}

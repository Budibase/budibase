const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  await ctx.instance.templateApi.upgradeData(ctx.request.body.newHierarchy)
  ctx.response.status = StatusCodes.OK
}

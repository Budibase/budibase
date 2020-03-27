const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  const accessLevels = ctx.request.body.accessLevels
  accessLevels.version = 0 
  await ctx.instance.authApi.saveAccessLevels(accessLevels)
  await ctx.instance.templateApi.upgradeData(ctx.request.body.newHierarchy)
  ctx.response.status = StatusCodes.OK
}

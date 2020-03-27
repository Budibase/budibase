const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  const existingAccessLevels = await ctx.instance.authApi.loadAccessLevels()
  const accessLevels = ctx.request.body.accessLevels
  accessLevels.version = existingAccessLevels.version
  await ctx.instance.authApi.saveAccessLevels(accessLevels)
  await ctx.instance.templateApi.upgradeData(ctx.request.body.newHierarchy)
  ctx.response.status = StatusCodes.OK
}

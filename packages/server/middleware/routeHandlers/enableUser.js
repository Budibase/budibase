const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  await ctx.instance.authApi.enableUser(ctx.request.body.username)
  ctx.response.status = StatusCodes.OK
}

const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  await ctx.instance.authApi.disableUser(ctx.request.body.username)

  await ctx.master.removeSessionsForUser(
    ctx.params.appname,
    ctx.request.body.username
  )
  ctx.response.status = StatusCodes.OK
}

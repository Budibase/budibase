const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  const user = await ctx.master.authenticate(
    ctx.sessionId,
    ctx.params.appname,
    ctx.request.body.username,
    ctx.request.body.password
  )
  if (!user) {
    ctx.throw(StatusCodes.UNAUTHORIZED, "invalid username or password")
  }
  ctx.body = user.user_json
  ctx.response.status = StatusCodes.OK
}

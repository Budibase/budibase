const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  await ctx.instance.authApi.createUser(
    ctx.request.body.user,
    ctx.request.body.password
  )

  ctx.response.status = StatusCodes.OK
}

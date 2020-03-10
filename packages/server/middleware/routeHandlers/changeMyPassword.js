const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  await ctx.instance.authApi.changeMyPassword(
    ctx.request.body.currentPassword,
    ctx.request.body.newPassword
  )
  ctx.response.status = StatusCodes.OK
}

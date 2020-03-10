const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  const instanceApi = await ctx.master.getFullAccessInstanceApiForUsername(
    ctx.params.appname,
    ctx.request.body.username
  )

  if (!instanceApi) {
    ctx.request.status = StatusCodes.OK
    return
  }

  await instanceApi.authApi.setPasswordFromTemporaryCode(
    ctx.request.body.tempCode,
    ctx.request.body.newPassword
  )

  ctx.response.status = StatusCodes.OK
}

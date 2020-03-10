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

  await instanceApi.authApi.createTemporaryAccess(ctx.request.body.username)

  ctx.response.status = StatusCodes.OK
}

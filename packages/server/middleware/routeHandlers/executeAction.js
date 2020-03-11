const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  ctx.body = await ctx.instance.actionApi.execute(
    ctx.request.body.actionname,
    ctx.request.body.parameters
  )
  ctx.response.status = StatusCodes.OK
}

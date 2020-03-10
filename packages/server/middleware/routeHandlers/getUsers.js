const StatusCodes = require("../../utilities/statusCodes")

module.exports = async ctx => {
  ctx.body = await ctx.instance.authApi.getUsers()
  ctx.response.status = StatusCodes.OK
}

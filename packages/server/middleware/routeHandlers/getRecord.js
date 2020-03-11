const StatusCodes = require("../../utilities/statusCodes")
const { getRecordKey } = require("./helpers")

module.exports = async ctx => {
  try {
    ctx.body = await ctx.instance.recordApi.load(
      getRecordKey(ctx.params.appname, ctx.request.path)
    )
    ctx.response.status = StatusCodes.OK
  } catch (e) {
    // need to be catching for 404s here
    ctx.response.status = StatusCodes.INTERAL_ERROR
    ctx.response.body = e.message
  }
}

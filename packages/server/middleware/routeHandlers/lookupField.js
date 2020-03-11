const StatusCodes = require("../../utilities/statusCodes")
const { getRecordKey } = require("./helpers")

module.exports = async ctx => {
  const recordKey = getRecordKey(ctx.params.appname, ctx.request.path)
  const fields = ctx.query.fields.split(",")
  const recordContext = await ctx.instance.recordApi.getContext(recordKey)
  const allContext = []
  for (let field of fields) {
    allContext.push(await recordContext.referenceOptions(field))
  }
  ctx.body = allContext
  ctx.response.status = StatusCodes.OK
}

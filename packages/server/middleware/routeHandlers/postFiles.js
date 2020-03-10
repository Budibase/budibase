const StatusCodes = require("../../utilities/statusCodes")
const { getRecordKey } = require("./helpers")
const fs = require("fs")

module.exports = async ctx => {
  const file = ctx.request.files.file
  ctx.body = await ctx.instance.recordApi.uploadFile(
    getRecordKey(ctx.params.appname, ctx.request.path),
    fs.createReadStream(file.path),
    file.name
  )
  ctx.response.status = StatusCodes.OK
}

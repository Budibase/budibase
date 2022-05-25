const { streamBackup } = require("../../utilities/fileSystem")

exports.exportAppDump = async function (ctx) {
  let { appId, includeRows } = ctx.query
  const appName = decodeURI(ctx.query.appname)
  includeRows = includeRows === "true"
  const backupIdentifier = `${appName}-export-${new Date().getTime()}.txt`
  ctx.attachment(backupIdentifier)

  ctx.body = await streamBackup(appId, includeRows)
}

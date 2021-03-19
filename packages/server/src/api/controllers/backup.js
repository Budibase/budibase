const { performBackup } = require("../../utilities/fileSystem")

exports.exportAppDump = async function(ctx) {
  const { appId } = ctx.query
  const appname = decodeURI(ctx.query.appname)
  const backupIdentifier = `${appname}Backup${new Date().getTime()}.txt`

  ctx.attachment(backupIdentifier)
  ctx.body = await performBackup(appId, backupIdentifier)
}

const { streamBackup } = require("../../utilities/fileSystem")
const { events, context } = require("@budibase/backend-core")
const { DocumentTypes } = require("../../db/utils")

exports.exportAppDump = async function (ctx) {
  const { appId } = ctx.query
  const appName = decodeURI(ctx.query.appname)
  const backupIdentifier = `${appName}-export-${new Date().getTime()}.txt`
  ctx.attachment(backupIdentifier)
  ctx.body = await streamBackup(appId)

  await context.doInAppContext(appId, async () => {
    const appDb = context.getAppDB()
    const app = await appDb.get(DocumentTypes.APP_METADATA)
    await events.app.exported(app)
  })
}

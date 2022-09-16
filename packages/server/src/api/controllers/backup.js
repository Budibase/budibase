const { streamBackup } = require("../../utilities/fileSystem")
const { events, context } = require("@budibase/backend-core")
const { DocumentType } = require("../../db/utils")
const { isQsTrue } = require("../../utilities")

exports.exportAppDump = async function (ctx) {
  let { appId, excludeRows } = ctx.query
  const appName = decodeURI(ctx.query.appname)
  excludeRows = isQsTrue(excludeRows)
  const backupIdentifier = `${appName}-export-${new Date().getTime()}.txt`
  ctx.attachment(backupIdentifier)
  ctx.body = await streamBackup(appId, excludeRows)

  await context.doInAppContext(appId, async () => {
    const appDb = context.getAppDB()
    const app = await appDb.get(DocumentType.APP_METADATA)
    await events.app.exported(app)
  })
}

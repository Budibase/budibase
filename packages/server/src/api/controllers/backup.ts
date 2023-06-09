import sdk from "../../sdk"
import { events, context } from "@budibase/backend-core"
import { DocumentType } from "../../db/utils"
import { isQsTrue } from "../../utilities"

export async function exportAppDump(ctx: any) {
  let { appId, excludeRows = false, encryptPassword } = ctx.query
  // remove the 120 second limit for the request
  ctx.req.setTimeout(0)
  const appName = decodeURI(ctx.query.appname)
  excludeRows = isQsTrue(excludeRows)
  const extension = encryptPassword ? "data" : "tar.gz"
  const backupIdentifier = `${appName}-export-${new Date().getTime()}.${extension}`
  ctx.attachment(backupIdentifier)
  ctx.body = await sdk.backups.streamExportApp({
    appId,
    excludeRows,
    encryptPassword,
  })

  await context.doInAppContext(appId, async () => {
    const appDb = context.getAppDB()
    const app = await appDb.get(DocumentType.APP_METADATA)
    await events.app.exported(app)
  })
}

import sdk from "../../sdk"
import { events, context } from "@budibase/backend-core"
import { DocumentType } from "../../db/utils"
import { isQsTrue } from "../../utilities"

export async function exportAppDump(ctx: any) {
  let { appId, excludeRows } = ctx.query
  const appName = decodeURI(ctx.query.appname)
  excludeRows = isQsTrue(excludeRows)
  const backupIdentifier = `${appName}-export-${new Date().getTime()}.tar.gz`
  ctx.attachment(backupIdentifier)
  ctx.body = await sdk.backups.streamExportApp(appId, excludeRows)

  await context.doInAppContext(appId, async () => {
    const appDb = context.getAppDB()
    const app = await appDb.get(DocumentType.APP_METADATA)
    await events.app.exported(app)
  })
}

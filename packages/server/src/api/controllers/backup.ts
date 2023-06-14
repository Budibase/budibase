import sdk from "../../sdk"
import { events, context, db } from "@budibase/backend-core"
import { DocumentType } from "../../db/utils"
import { Ctx } from "@budibase/types"

interface ExportAppDumpRequest {
  excludeRows: boolean
}

export async function exportAppDump(ctx: Ctx<ExportAppDumpRequest>) {
  const { appId } = ctx.query as any
  const { excludeRows } = ctx.request.body

  const [app] = await db.getAppsByIDs([appId])
  const appName = app.name

  // remove the 120 second limit for the request
  ctx.req.setTimeout(0)

  const backupIdentifier = `${appName}-export-${new Date().getTime()}.tar.gz`
  ctx.attachment(backupIdentifier)
  ctx.body = await sdk.backups.streamExportApp(appId, excludeRows)

  await context.doInAppContext(appId, async () => {
    const appDb = context.getAppDB()
    const app = await appDb.get(DocumentType.APP_METADATA)
    await events.app.exported(app)
  })
}

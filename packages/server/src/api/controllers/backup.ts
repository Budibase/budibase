import { context, db, events } from "@budibase/backend-core"
import {
  ClearBackupErrorRequest,
  ClearBackupErrorResponse,
  Ctx,
  ExportAppDumpRequest,
  ExportAppDumpResponse,
  UserCtx,
  Workspace,
} from "@budibase/types"
import { DocumentType } from "../../db/utils"
import sdk from "../../sdk"

export async function exportAppDump(
  ctx: Ctx<ExportAppDumpRequest, ExportAppDumpResponse>
) {
  const { appId } = ctx.query as any
  const { excludeRows, encryptPassword } = ctx.request.body

  const [app] = await db.getAppsByIDs([appId])
  const appName = app.name

  // remove the 120 second limit for the request
  ctx.req.setTimeout(0)

  const extension = encryptPassword ? "enc.tar.gz" : "tar.gz"
  const backupIdentifier = `${appName}-export-${new Date().getTime()}.${extension}`
  ctx.attachment(backupIdentifier)
  ctx.body = await sdk.backups.streamExportApp({
    appId,
    excludeRows,
    encryptPassword,
  })

  await context.doInAppContext(appId, async () => {
    const appDb = context.getAppDB()
    const app = await appDb.get<Workspace>(DocumentType.APP_METADATA)
    await events.app.exported(app)
  })
}

export async function clearBackupError(
  ctx: UserCtx<ClearBackupErrorRequest, ClearBackupErrorResponse>
) {
  const { backupId, appId } = ctx.request.body
  await context.doInAppContext(appId, async () => {
    await sdk.backups.clearErrors(backupId)
  })

  ctx.body = { message: `Backup errors cleared.` }
}

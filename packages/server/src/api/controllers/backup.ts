import { context, db, events } from "@budibase/backend-core"
import {
  ClearBackupErrorRequest,
  ClearBackupErrorResponse,
  Ctx,
  ExportWorkspaceDumpRequest,
  ExportWorkspaceDumpResponse,
  UserCtx,
  Workspace,
} from "@budibase/types"
import { DocumentType } from "../../db/utils"
import sdk from "../../sdk"

export async function exportAppDump(
  ctx: Ctx<ExportWorkspaceDumpRequest, ExportWorkspaceDumpResponse>
) {
  const { appId } = ctx.query as any
  const { excludeRows, encryptPassword } = ctx.request.body

  const [workspace] = await db.getWorkspacesByIDs([appId])
  const workspaceName = workspace.name

  // remove the 120 second limit for the request
  ctx.req.setTimeout(0)

  const extension = encryptPassword ? "enc.tar.gz" : "tar.gz"
  const backupIdentifier = `${workspaceName}-export-${new Date().getTime()}.${extension}`
  ctx.attachment(backupIdentifier)
  ctx.body = await sdk.backups.streamExportApp({
    appId,
    excludeRows,
    encryptPassword,
  })

  await context.doInWorkspaceContext(appId, async () => {
    const appDb = context.getWorkspaceDB()
    const app = await appDb.get<Workspace>(DocumentType.WORKSPACE_METADATA)
    await events.app.exported(app)
  })
}

export async function clearBackupError(
  ctx: UserCtx<ClearBackupErrorRequest, ClearBackupErrorResponse>
) {
  const { backupId, appId } = ctx.request.body
  await context.doInWorkspaceContext(appId, async () => {
    await sdk.backups.clearErrors(backupId)
  })

  ctx.body = { message: `Backup errors cleared.` }
}

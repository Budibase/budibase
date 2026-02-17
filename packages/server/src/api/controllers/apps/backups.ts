import { context, events } from "@budibase/backend-core"
import {
  BackupTrigger,
  CreateWorkspaceBackupRequest,
  CreateWorkspaceBackupResponse,
  DeleteWorkspaceBackupsRequest,
  DeleteWorkspaceBackupsResponse,
  ImportWorkspaceBackupRequest,
  ImportWorkspaceBackupResponse,
  SearchWorkspaceBackupsRequest,
  UpdateWorkspaceBackupRequest,
  UserCtx,
} from "@budibase/types"
import { backups, utils } from "@budibase/pro"

async function checkAppId(ctx: UserCtx, appId?: string) {
  if (!appId) {
    ctx.throw(400, "App ID missing")
  }
  if (!(await utils.workspaceExists(appId))) {
    ctx.throw(400, `Provided app ID: ${appId} - is invalid.`)
  }
}

export async function manualBackup(
  ctx: UserCtx<CreateWorkspaceBackupRequest, CreateWorkspaceBackupResponse>
) {
  const appId = ctx.params.appId
  await checkAppId(ctx, appId)
  const { body } = ctx.request
  const createdBy = ctx.user?._id
  const backupId = await backups.triggerAppBackup(appId, BackupTrigger.MANUAL, {
    name: body.name,
    createdBy,
  })
  if (!backupId) {
    ctx.throw(500, "Unable to start backup.")
  }
  ctx.body = {
    backupId,
    message: "Backup triggered - process starting.",
  }
}

export async function importBackup(
  ctx: UserCtx<ImportWorkspaceBackupRequest, ImportWorkspaceBackupResponse>
) {
  const appId = ctx.params.appId
  await checkAppId(ctx, appId)
  const backupId = ctx.params.backupId
  const nameForBackup = ctx.request.body.name
  const response = await backups.triggerAppRestore(
    appId,
    backupId,
    nameForBackup,
    ctx.user?._id
  )
  if (!response) {
    ctx.throw(500, "Unable to start restore.")
  }
  await events.backup.appBackupRestored(response.metadata)
  ctx.body = {
    restoreId: response?.restoreId,
    message: "Restore triggered - process starting.",
  }
}

export async function deleteBackup(ctx: UserCtx) {
  const appId = ctx.params.appId
  await checkAppId(ctx, appId)
  const backupId = ctx.params.backupId
  await backups.deleteAppBackup(backupId)
  ctx.body = {
    message: "Backup deleted successfully.",
  }
}

export async function deleteBackups(
  ctx: UserCtx<DeleteWorkspaceBackupsRequest, DeleteWorkspaceBackupsResponse>
) {
  const appId = context.getWorkspaceId()
  await checkAppId(ctx, appId)
  const { backupIds } = ctx.request.body

  if (!Array.isArray(backupIds) || backupIds.length === 0) {
    ctx.throw(400, "backupIds must be a non-empty array")
  }

  const results = await backups.deleteAppBackups(backupIds)
  const successCount = results.filter(r => r.success).length
  const failureCount = results.length - successCount

  ctx.body = {
    message: `${successCount} backups deleted successfully${failureCount > 0 ? `, ${failureCount} failed` : ""}.`,
    results,
    successCount,
    failureCount,
  }
}

export async function fetchBackups(ctx: UserCtx) {
  const appId = ctx.params.appId
  await checkAppId(ctx, appId)
  const body = ctx.request.body as SearchWorkspaceBackupsRequest
  if (body?.trigger) {
    body.trigger = body.trigger.toLowerCase() as BackupTrigger
    if (!Object.values(BackupTrigger).includes(body.trigger)) {
      ctx.throw(400, "Provided trigger is not a valid option.")
    }
  }
  ctx.body = await backups.fetchAppBackups(appId, {
    paginate: true,
    ...body,
  })
}

export async function updateBackup(ctx: UserCtx) {
  const appId = ctx.params.appId
  await checkAppId(ctx, appId)
  const backupId = ctx.params.backupId
  const body = ctx.request.body as UpdateWorkspaceBackupRequest
  ctx.body = await backups.updateAppBackup(backupId, body.name)
}

export async function downloadBackup(ctx: UserCtx) {
  const appId = ctx.params.appId
  await checkAppId(ctx, appId)
  const backupId = ctx.params.backupId
  const { metadata, stream } = await backups.getBackupDownloadStream(backupId)
  ctx.attachment(`backup-${metadata.timestamp}.tar.gz`)
  ctx.body = stream
}

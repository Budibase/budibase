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

async function checkWorkspaceId(ctx: UserCtx, workspaceId?: string) {
  if (!workspaceId) {
    ctx.throw(400, "Workspace ID missing")
  }
  if (!(await utils.workspaceExists(workspaceId))) {
    ctx.throw(400, `Provided workspace ID: ${workspaceId} - is invalid.`)
  }
}

export async function manualBackup(
  ctx: UserCtx<CreateWorkspaceBackupRequest, CreateWorkspaceBackupResponse>
) {
  const workspaceId = ctx.params.appId
  await checkWorkspaceId(ctx, workspaceId)
  const { body } = ctx.request
  const createdBy = ctx.user?._id
  const backupId = await backups.triggerWorkspaceBackup(
    workspaceId,
    BackupTrigger.MANUAL,
    {
      name: body.name,
      createdBy,
    }
  )
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
  const workspaceId = ctx.params.appId
  await checkWorkspaceId(ctx, workspaceId)
  const backupId = ctx.params.backupId
  const nameForBackup = ctx.request.body.name
  const response = await backups.triggerWorkspaceRestore(
    workspaceId,
    backupId,
    nameForBackup,
    ctx.user?._id
  )
  if (!response) {
    ctx.throw(500, "Unable to start restore.")
  }
  await events.backup.workspaceBackupRestored(response.metadata)
  ctx.body = {
    restoreId: response?.restoreId,
    message: "Restore triggered - process starting.",
  }
}

export async function deleteBackup(ctx: UserCtx) {
  const workspace = ctx.params.appId
  await checkWorkspaceId(ctx, workspace)
  const backupId = ctx.params.backupId
  await backups.deleteWorkspaceBackup(backupId)
  ctx.body = {
    message: "Backup deleted successfully.",
  }
}

export async function deleteBackups(
  ctx: UserCtx<DeleteWorkspaceBackupsRequest, DeleteWorkspaceBackupsResponse>
) {
  const workspaceId = context.getWorkspaceId()
  await checkWorkspaceId(ctx, workspaceId)
  const { backupIds } = ctx.request.body

  if (!Array.isArray(backupIds) || backupIds.length === 0) {
    ctx.throw(400, "backupIds must be a non-empty array")
  }

  const results = await backups.deleteWorkspaceBackups(backupIds)
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
  const workspaceId = ctx.params.appId
  await checkWorkspaceId(ctx, workspaceId)
  const body = ctx.request.body as SearchWorkspaceBackupsRequest
  if (body?.trigger) {
    body.trigger = body.trigger.toLowerCase() as BackupTrigger
    if (!Object.values(BackupTrigger).includes(body.trigger)) {
      ctx.throw(400, "Provided trigger is not a valid option.")
    }
  }
  ctx.body = await backups.fetchWorkspaceBackups(workspaceId, {
    paginate: true,
    ...body,
  })
}

export async function updateBackup(ctx: UserCtx) {
  const workspaceId = ctx.params.appId
  await checkWorkspaceId(ctx, workspaceId)
  const backupId = ctx.params.backupId
  const body = ctx.request.body as UpdateWorkspaceBackupRequest
  ctx.body = await backups.updateWorkspaceBackup(backupId, body.name)
}

export async function downloadBackup(ctx: UserCtx) {
  const workspaceId = ctx.params.appId
  await checkWorkspaceId(ctx, workspaceId)
  const backupId = ctx.params.backupId
  const { metadata, stream } = await backups.getBackupDownloadStream(backupId)
  ctx.attachment(`backup-${metadata.timestamp}.tar.gz`)
  ctx.body = stream
}

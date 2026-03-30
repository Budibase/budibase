import {
  cache,
  context,
  db,
  events,
  objectStore,
  utils,
} from "@budibase/backend-core"
import {
  BackupFetchOpts,
  BackupStatus,
  BackupTrigger,
  BackupType,
  DocumentType,
  Workspace,
  WorkspaceBackupContents,
  WorkspaceBackupMetadata,
} from "@budibase/types"
import fs from "fs"
import { join } from "path"
import { backups } from "../../db"
import * as features from "../features"
import { getBackupQueue } from "./queue"

async function storeWorkspaceBackupMetadata(
  metadata: WorkspaceBackupMetadata,
  opts: { filename?: string } = {}
) {
  return backups.storeWorkspaceBackupMetadata(metadata, opts)
}

function getTimestamps(status: BackupStatus) {
  const timestamp = new Date().toISOString()
  switch (status) {
    case BackupStatus.COMPLETE:
    case BackupStatus.FAILED:
      return { timestamp, finishedAt: timestamp }
    case BackupStatus.STARTED:
      return { timestamp, startedAt: timestamp }
    case BackupStatus.PENDING:
      return { timestamp, createdAt: timestamp }
  }
}

async function updateBackupStatus(
  id: string,
  status: BackupStatus,
  contents?: WorkspaceBackupContents,
  filename?: string
) {
  const backup: WorkspaceBackupMetadata = await getWorkspaceBackup(id)
  // keep backup event timestamp up to date with when it completes/fails
  return await backups.storeWorkspaceBackupMetadata(
    {
      ...backup,
      ...getTimestamps(status),
      contents,
      status,
      type: BackupType.BACKUP,
    },
    { filename, docId: id }
  )
}

async function updateRestoreStatus(
  id: string,
  rev: string,
  status: BackupStatus
) {
  const restore: WorkspaceBackupMetadata = await getWorkspaceBackup(id)
  // keep restore event timestamp up to date with when it completes/fails
  return await backups.storeWorkspaceBackupMetadata(
    {
      ...restore,
      ...getTimestamps(status),
      status,
      type: BackupType.RESTORE,
      trigger: BackupTrigger.MANUAL,
    },
    { docId: id, docRev: rev }
  )
}

async function getWorkspaceBackup(backupId: string) {
  return backups.getWorkspaceBackupMetadata(backupId)
}

async function updateWorkspaceBackup(backupId: string, backupName: string) {
  return backups.updateWorkspaceBackupMetadata(backupId, backupName)
}

async function deleteWorkspaceBackup(backupId: string) {
  const metadata = await backups.getWorkspaceBackupMetadata(backupId)
  if (metadata.filename) {
    await objectStore.deleteFile(
      objectStore.ObjectStoreBuckets.BACKUPS,
      metadata.filename
    )
  }
  return backups.deleteWorkspaceBackupMetadata(backupId)
}

async function deleteWorkspaceBackups(backupIds: string[]) {
  const results = []

  for (const backupId of backupIds) {
    try {
      await deleteWorkspaceBackup(backupId)
      results.push({ backupId, success: true })
    } catch (error) {
      results.push({
        backupId,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return results
}

async function fetchWorkspaceBackups(
  workspaceId: string,
  opts?: BackupFetchOpts
) {
  return backups.fetchWorkspaceBackups(workspaceId, opts)
}

async function getBackupDownloadStream(backupId: string) {
  const metadata = await backups.getWorkspaceBackupMetadata(backupId)
  if (!metadata.filename) {
    throw new Error("Backup incomplete - cannot download.")
  }
  const { stream } = await objectStore.getReadStream(
    objectStore.ObjectStoreBuckets.BACKUPS,
    metadata.filename
  )
  return { metadata, stream }
}

async function downloadWorkspaceBackup(backupId: string): Promise<string> {
  const { stream } = await getBackupDownloadStream(backupId)
  const path = join(objectStore.budibaseTempDir(), utils.newid())
  const writeStream = fs.createWriteStream(path)
  return new Promise((resolve, reject) => {
    stream.on("error", reject)
    writeStream.on("error", reject)
    stream.pipe(writeStream).on("close", () => resolve(path))
  })
}

async function triggerWorkspaceBackup(
  workspaceId: string,
  trigger: BackupTrigger,
  opts: { createdBy?: string; name?: string } = {}
): Promise<string | undefined> {
  // store immediately, get rev and id as incomplete
  let backup
  try {
    backup = await storeWorkspaceBackupMetadata({
      appId: workspaceId,
      trigger,
      timestamp: new Date().toISOString(),
      status: BackupStatus.PENDING,
      type: BackupType.BACKUP,
      ...opts,
    })
  } catch (err: any) {
    // there already is a backup for this exact millisecond, no need
    // for a new one
    if (err.status === 409) {
      return
    } else {
      throw err
    }
  }
  // kick off job
  await getBackupQueue().add({
    docId: backup.id,
    docRev: backup.rev,
    appId: workspaceId,
    export: {
      trigger,
      ...opts,
    },
  })
  await events.backup.workspaceBackupTriggered(
    workspaceId,
    backup.id,
    BackupType.BACKUP,
    trigger,
    opts?.name as string
  )
  return backup.id
}

async function triggerWorkspaceRestore(
  workspaceId: string,
  backupId: string,
  nameForBackup: string,
  createdBy?: string
): Promise<{ restoreId: string; metadata: any } | void> {
  const metadata = await getWorkspaceBackup(backupId)
  // store immediately, get rev and id as incomplete
  let restore
  try {
    restore = await storeWorkspaceBackupMetadata({
      appId: workspaceId,
      timestamp: new Date().toISOString(),
      status: BackupStatus.PENDING,
      type: BackupType.RESTORE,
      createdBy,
    })
  } catch (err: any) {
    // there already is a restore for this exact millisecond, no need
    // for a new one
    if (err?.status === 409) {
      return
    } else {
      throw err
    }
  }
  await getBackupQueue().add({
    appId: workspaceId,
    docId: restore.id,
    docRev: restore.rev,
    import: {
      nameForBackup,
      backupId,
      createdBy,
    },
  })
  return { restoreId: restore.id, metadata }
}

async function trackBackupError(
  workspaceId: string,
  backupId: string,
  error: string
) {
  const prodWorkspaceId = db.getProdWorkspaceID(workspaceId)
  await context.doInWorkspaceContext(prodWorkspaceId, async () => {
    const database = context.getProdWorkspaceDB()

    const databaseExists = await database.exists()
    if (!databaseExists) {
      return
    }

    const metadata = await database.tryGet<Workspace>(
      DocumentType.WORKSPACE_METADATA
    )
    if (!metadata) {
      return
    }

    if (!metadata.backupErrors) {
      metadata.backupErrors = {}
    }

    if (!metadata.backupErrors[backupId]) {
      metadata.backupErrors[backupId] = []
    }

    metadata.backupErrors[backupId].push(error)
    await database.put(metadata)
    await cache.workspace.invalidateWorkspaceMetadata(metadata.appId, metadata)
  })
}

/**
 * Rather than exporting functions directly from licensed sdks,
 * we use the licensed function wrapper to apply license restrictions
 * with minimal interference to internal logic.
 */
const pkg = {
  isEnabled: features.isBackupsEnabled,
  triggerWorkspaceRestore: features.checkBackups(triggerWorkspaceRestore),
  triggerWorkspaceBackup: features.checkBackups(triggerWorkspaceBackup),
  getBackupDownloadStream: features.checkBackups(getBackupDownloadStream),
  downloadWorkspaceBackup: features.checkBackups(downloadWorkspaceBackup),
  fetchWorkspaceBackups: features.checkBackups(fetchWorkspaceBackups),
  storeWorkspaceBackupMetadata: features.checkBackups(
    storeWorkspaceBackupMetadata
  ),
  updateBackupStatus: features.checkBackups(updateBackupStatus),
  updateRestoreStatus: features.checkBackups(updateRestoreStatus),
  getWorkspaceBackup: features.checkBackups(getWorkspaceBackup),
  updateWorkspaceBackup: features.checkBackups(updateWorkspaceBackup),
  deleteWorkspaceBackup: features.checkBackups(deleteWorkspaceBackup),
  deleteWorkspaceBackups: features.checkBackups(deleteWorkspaceBackups),
  trackBackupError: features.checkBackups(trackBackupError),
}

export default pkg

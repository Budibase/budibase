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

async function storeAppBackupMetadata(
  metadata: WorkspaceBackupMetadata,
  opts: { filename?: string } = {}
) {
  return backups.storeAppBackupMetadata(metadata, opts)
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
  const backup: WorkspaceBackupMetadata = await getAppBackup(id)
  // keep backup event timestamp up to date with when it completes/fails
  return await backups.storeAppBackupMetadata(
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
  const restore: WorkspaceBackupMetadata = await getAppBackup(id)
  // keep restore event timestamp up to date with when it completes/fails
  return await backups.storeAppBackupMetadata(
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

async function getAppBackup(backupId: string) {
  return backups.getAppBackupMetadata(backupId)
}

async function updateAppBackup(backupId: string, backupName: string) {
  return backups.updateAppBackupMetadata(backupId, backupName)
}

async function deleteAppBackup(backupId: string) {
  const metadata = await backups.getAppBackupMetadata(backupId)
  if (metadata.filename) {
    await objectStore.deleteFile(
      objectStore.ObjectStoreBuckets.BACKUPS,
      metadata.filename
    )
  }
  return backups.deleteAppBackupMetadata(backupId)
}

async function deleteAppBackups(backupIds: string[]) {
  const results = []

  for (const backupId of backupIds) {
    try {
      await deleteAppBackup(backupId)
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

async function fetchAppBackups(appId: string, opts?: BackupFetchOpts) {
  return backups.fetchAppBackups(appId, opts)
}

async function getBackupDownloadStream(backupId: string) {
  const metadata = await backups.getAppBackupMetadata(backupId)
  if (!metadata.filename) {
    throw new Error("Backup incomplete - cannot download.")
  }
  const { stream } = await objectStore.getReadStream(
    objectStore.ObjectStoreBuckets.BACKUPS,
    metadata.filename
  )
  return { metadata, stream }
}

async function downloadAppBackup(backupId: string): Promise<string> {
  const { stream } = await getBackupDownloadStream(backupId)
  const path = join(objectStore.budibaseTempDir(), utils.newid())
  const writeStream = fs.createWriteStream(path)
  return new Promise((resolve, reject) => {
    stream.on("error", reject)
    writeStream.on("error", reject)
    stream.pipe(writeStream).on("close", () => resolve(path))
  })
}

async function triggerAppBackup(
  appId: string,
  trigger: BackupTrigger,
  opts: { createdBy?: string; name?: string } = {}
): Promise<string | undefined> {
  // store immediately, get rev and id as incomplete
  let backup
  try {
    backup = await storeAppBackupMetadata({
      appId,
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
    appId,
    export: {
      trigger,
      ...opts,
    },
  })
  await events.backup.appBackupTriggered(
    appId,
    backup.id,
    BackupType.BACKUP,
    trigger,
    opts?.name as string
  )
  return backup.id
}

async function triggerAppRestore(
  appId: string,
  backupId: string,
  nameForBackup: string,
  createdBy?: string
): Promise<{ restoreId: string; metadata: any } | void> {
  const metadata = await getAppBackup(backupId)
  // store immediately, get rev and id as incomplete
  let restore
  try {
    restore = await storeAppBackupMetadata({
      appId,
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
    appId,
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
  appId: string,
  backupId: string,
  error: string
) {
  const prodAppId = db.getProdWorkspaceID(appId)
  await context.doInWorkspaceContext(prodAppId, async () => {
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
  triggerAppRestore: features.checkBackups(triggerAppRestore),
  triggerAppBackup: features.checkBackups(triggerAppBackup),
  getBackupDownloadStream: features.checkBackups(getBackupDownloadStream),
  downloadAppBackup: features.checkBackups(downloadAppBackup),
  fetchAppBackups: features.checkBackups(fetchAppBackups),
  storeAppBackupMetadata: features.checkBackups(storeAppBackupMetadata),
  updateBackupStatus: features.checkBackups(updateBackupStatus),
  updateRestoreStatus: features.checkBackups(updateRestoreStatus),
  getAppBackup: features.checkBackups(getAppBackup),
  updateAppBackup: features.checkBackups(updateAppBackup),
  deleteAppBackup: features.checkBackups(deleteAppBackup),
  deleteAppBackups: features.checkBackups(deleteAppBackups),
  trackBackupError: features.checkBackups(trackBackupError),
}

export default pkg

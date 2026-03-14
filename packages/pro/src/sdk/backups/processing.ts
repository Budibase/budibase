import {
  db,
  db as dbCore,
  logging,
  objectStore,
  tenancy,
} from "@budibase/backend-core"
import {
  BackupStatus,
  BackupTrigger,
  BackupType,
  WorkspaceBackupContents,
  WorkspaceBackupQueueData,
} from "@budibase/types"
import { Job } from "bull"
import fs from "fs"
import { BackupProcessingOpts } from "../../types"
import backups from "./backup"
import { getBackupQueue } from "./queue"

export async function init(opts: BackupProcessingOpts) {
  getBackupQueue().process(async (job: Job) => {
    const data = job.data as WorkspaceBackupQueueData
    try {
      if (data.export) {
        console.log("Exporting app backup:", data.appId, data.export.trigger)
        return exportProcessor(job, opts)
      } else if (data.import) {
        console.log("Importing app backup:", data.appId, data.import.backupId)
        return importProcessor(job, opts)
      }
    } catch (err: any) {
      logging.logAlert(
        `Failed to perform backup for app ID: ${data.appId}`,
        err
      )
    }
  })
}

type RunBackupOpts = {
  processing: BackupProcessingOpts
  doc?: { id: string; rev: string }
  createdBy?: string
  name?: string
}

async function removeExistingApp(devId: string) {
  const devDb = dbCore.getDB(devId, { skip_setup: true })
  await devDb.destroy()
}

async function runBackup(
  trigger: BackupTrigger,
  tenantId: string,
  appId: string,
  opts: RunBackupOpts
) {
  const devWorkspaceId = dbCore.getDevWorkspaceID(appId),
    prodAppId = dbCore.getProdWorkspaceID(appId)
  const timestamp = new Date().toISOString()
  const updateMetadata = async (
    status: BackupStatus,
    updateOpts?: { filename?: string; contents?: WorkspaceBackupContents }
  ) => {
    if (opts?.doc) {
      await backups.updateBackupStatus(
        opts.doc.id,
        status,
        updateOpts?.contents,
        updateOpts?.filename
      )
    } else {
      await backups.storeAppBackupMetadata(
        {
          appId: prodAppId,
          timestamp,
          trigger,
          status,
          name: opts?.name,
          type: BackupType.BACKUP,
          contents: updateOpts?.contents,
          createdBy: opts?.createdBy,
        },
        { filename: updateOpts?.filename }
      )
    }
  }
  try {
    const prodDb = dbCore.getDB(prodAppId, { skip_setup: true })
    const prodExists = await prodDb.exists()
    const exportAppId = prodExists ? prodAppId : devWorkspaceId

    const tarPath = await opts.processing.exportAppFn(exportAppId, {
      tar: true,
    })
    const contents = await opts.processing.statsFn(devWorkspaceId)
    let filename = `${prodAppId}/backup-${timestamp}.tar.gz`
    const bucket = objectStore.ObjectStoreBuckets.BACKUPS
    const fileStream = fs.createReadStream(tarPath)
    await objectStore.streamUpload({
      bucket,
      filename,
      stream: fileStream,
      extra: {
        type: "application/gzip",
        metadata: {
          name: opts?.name,
          trigger,
          timestamp,
          appId: prodAppId,
        },
      },
    })
    await updateMetadata(BackupStatus.COMPLETE, { filename, contents })
    // clear up the tarball after uploading it
    if (fs.existsSync(tarPath)) {
      fs.rmSync(tarPath)
    }
  } catch (err) {
    logging.logAlert("App backup error", err)
    await updateMetadata(BackupStatus.FAILED)
    // Track backup error in app metadata
    const backupId = opts?.doc?.id || `backup-${timestamp}`
    const errorMessage = err instanceof Error ? err.message : String(err)
    await backups.trackBackupError(
      prodAppId,
      backupId,
      `Backup export failed: ${errorMessage}`
    )
  }
}

async function importProcessor(job: Job, opts: BackupProcessingOpts) {
  const data: WorkspaceBackupQueueData = job.data
  const appId = data.appId,
    backupId = data.import!.backupId,
    nameForBackup = data.import!.nameForBackup,
    createdBy = data.import!.createdBy
  const tenantId = tenancy.getTenantIDFromWorkspaceID(appId) as string
  return tenancy.doInTenant(tenantId, async () => {
    const devWorkspaceId = dbCore.getDevWorkspaceID(appId)
    const prodWorkspaceId = dbCore.getProdWorkspaceID(appId)
    const tempAppId = `${devWorkspaceId}_temp_${Date.now()}`

    const { rev } = await backups.updateRestoreStatus(
      data.docId,
      data.docRev,
      BackupStatus.STARTED
    )
    // initially export the current state to disk - incase something goes wrong
    await runBackup(BackupTrigger.RESTORING, tenantId, appId, {
      processing: opts,
      createdBy,
      name: nameForBackup,
    })
    // get the backup ready on disk
    const path = await backups.downloadAppBackup(backupId)
    let status = BackupStatus.COMPLETE
    try {
      // import into temporary database first (devWorkspaceId used for prodAppId in object store upload)
      await opts.importAppFn(devWorkspaceId, dbCore.getDB(tempAppId), {
        file: {
          type: "application/gzip",
          path,
        },
        key: path,
      })

      // if import succeeds, replace dev and prod with the backup content
      await removeExistingApp(devWorkspaceId)

      const prodDb = dbCore.getDB(prodWorkspaceId, { skip_setup: true })
      if (await prodDb.exists()) {
        await removeExistingApp(prodWorkspaceId)
      }

      const devReplication = new db.Replication({
        source: tempAppId,
        target: devWorkspaceId,
      })
      await devReplication.replicate()
      await devReplication.close()

      const prodReplication = new db.Replication({
        source: tempAppId,
        target: prodWorkspaceId,
      })
      await prodReplication.replicate()
      await prodReplication.close()
    } catch (err: any) {
      logging.logAlert("App restore error", err)
      status = BackupStatus.FAILED
      // Track restore error in app metadata
      const errorMessage = err instanceof Error ? err.message : String(err)
      await backups.trackBackupError(
        appId,
        backupId,
        `Backup restore failed: ${errorMessage}`
      )
    } finally {
      try {
        const tempDb = dbCore.getDB(tempAppId, { skip_setup: true })
        await tempDb.destroy()
      } catch (cleanupErr) {
        // ignore cleanup errors
      }
    }
    await backups.updateRestoreStatus(data.docId, rev, status)
    if (fs.existsSync(path)) {
      fs.rmSync(path, { force: true })
    }
  })
}

async function exportProcessor(job: Job, opts: BackupProcessingOpts) {
  const data: WorkspaceBackupQueueData = job.data
  const appId = data.appId,
    trigger = data.export!.trigger,
    name = data.export!.name
  const tenantId = tenancy.getTenantIDFromWorkspaceID(appId) as string
  await tenancy.doInTenant(tenantId, async () => {
    try {
      const { rev } = await backups.updateBackupStatus(
        data.docId,
        BackupStatus.STARTED
      )
      return runBackup(trigger, tenantId, appId, {
        processing: opts,
        doc: { id: data.docId, rev },
        name,
      })
    } catch (err) {
      logging.logAlert("App backup error", err)
      // Track backup error in app metadata
      const errorMessage = err instanceof Error ? err.message : String(err)
      await backups.trackBackupError(
        appId,
        data.docId,
        `Backup export failed: ${errorMessage}`
      )
    }
  })
}

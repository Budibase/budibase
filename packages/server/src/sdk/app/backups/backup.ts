import { backups } from "@budibase/pro"
import { db as dbCore, objectStore, tenancy } from "@budibase/backend-core"
import {
  AppBackupQueueData,
  AppBackupStatus,
  AppBackupTrigger,
  AppBackupType,
} from "@budibase/types"
import { exportApp } from "./exports"
import { importApp } from "./imports"
import { calculateBackupStats } from "../statistics"
import { Job } from "bull"
import fs from "fs"
import env from "../../../environment"

type BackupOpts = {
  doc?: { id: string; rev: string }
  createdBy?: string
}

async function removeExistingApp(devId: string) {
  const devDb = dbCore.dangerousGetDB(devId, { skip_setup: true })
  await devDb.destroy()
}

async function runBackup(
  name: string,
  trigger: AppBackupTrigger,
  tenantId: string,
  appId: string,
  opts?: BackupOpts
) {
  const devAppId = dbCore.getDevAppID(appId),
    prodAppId = dbCore.getProdAppID(appId)
  const timestamp = new Date().toISOString()
  const tarPath = await exportApp(devAppId, { tar: true })
  const contents = await calculateBackupStats(devAppId)
  let filename = `${prodAppId}/backup-${timestamp}.tar.gz`
  // add the tenant to the bucket path if backing up within a multi-tenant environment
  if (env.MULTI_TENANCY) {
    filename = `${tenantId}/${filename}`
  }
  const bucket = objectStore.ObjectStoreBuckets.BACKUPS
  await objectStore.upload({
    path: tarPath,
    type: "application/gzip",
    bucket,
    filename,
    metadata: {
      name,
      trigger,
      timestamp,
      appId: prodAppId,
    },
  })
  if (opts?.doc) {
    await backups.updateBackupStatus(
      opts.doc.id,
      opts.doc.rev,
      AppBackupStatus.COMPLETE,
      contents,
      filename
    )
  } else {
    await backups.storeAppBackupMetadata(
      {
        appId: prodAppId,
        timestamp,
        name,
        trigger,
        type: AppBackupType.BACKUP,
        status: AppBackupStatus.COMPLETE,
        contents,
        createdBy: opts?.createdBy,
      },
      { filename }
    )
  }
  // clear up the tarball after uploading it
  fs.rmSync(tarPath)
}

async function importProcessor(job: Job) {
  const data: AppBackupQueueData = job.data
  const appId = data.appId,
    backupId = data.import!.backupId,
    nameForBackup = data.import!.nameForBackup,
    createdBy = data.import!.createdBy
  const tenantId = tenancy.getTenantIDFromAppID(appId) as string
  tenancy.doInTenant(tenantId, async () => {
    const devAppId = dbCore.getDevAppID(appId)
    const { rev } = await backups.updateRestoreStatus(
      data.docId,
      data.docRev,
      AppBackupStatus.PENDING
    )
    // initially export the current state to disk - incase something goes wrong
    await runBackup(
      nameForBackup,
      AppBackupTrigger.RESTORING,
      tenantId,
      appId,
      { createdBy }
    )
    // get the backup ready on disk
    const { path } = await backups.downloadAppBackup(backupId)
    // start by removing app database and contents of bucket - which will be updated
    await removeExistingApp(devAppId)
    let status = AppBackupStatus.COMPLETE
    try {
      await importApp(devAppId, dbCore.dangerousGetDB(devAppId), {
        file: {
          type: "application/gzip",
          path,
        },
        key: path,
      })
    } catch (err) {
      status = AppBackupStatus.FAILED
    }
    await backups.updateRestoreStatus(data.docId, rev, status)
  })
}

async function exportProcessor(job: Job) {
  const data: AppBackupQueueData = job.data
  const appId = data.appId,
    trigger = data.export!.trigger,
    name = data.export!.name || `${trigger} - backup`
  const tenantId = tenancy.getTenantIDFromAppID(appId) as string
  await tenancy.doInTenant(tenantId, async () => {
    const { rev } = await backups.updateBackupStatus(
      data.docId,
      data.docRev,
      AppBackupStatus.PENDING
    )
    return runBackup(name, trigger, tenantId, appId, {
      doc: { id: data.docId, rev },
    })
  })
}

export async function init() {
  await backups.addAppBackupProcessors(importProcessor, exportProcessor)
}

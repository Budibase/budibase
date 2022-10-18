import { backups } from "@budibase/pro"
import { objectStore, tenancy, db as dbCore } from "@budibase/backend-core"
import { AppBackupQueueData } from "@budibase/types"
import { exportApp } from "./exports"
import { importApp } from "./imports"
import { Job } from "bull"
import fs from "fs"
import env from "../../../environment"

async function removeExistingApp(devId: string) {
  const devDb = dbCore.dangerousGetDB(devId, { skip_setup: true })
  await devDb.destroy()
}

async function importProcessor(job: Job) {
  const data: AppBackupQueueData = job.data
  const appId = data.appId,
    backupId = data.import!.backupId
  const tenantId = tenancy.getTenantIDFromAppID(appId)
  tenancy.doInTenant(tenantId, async () => {
    const devAppId = dbCore.getDevAppID(appId)
    const performImport = async (path: string) => {
      await importApp(devAppId, dbCore.dangerousGetDB(devAppId), {
        file: {
          type: "application/gzip",
          path,
        },
        key: path,
      })
    }
    // initially export the current state to disk - incase something goes wrong
    const backupTarPath = await exportApp(devAppId, { tar: true })
    // get the backup ready on disk
    const { path } = await backups.downloadAppBackup(backupId)
    // start by removing app database and contents of bucket - which will be updated
    await removeExistingApp(devAppId)
    try {
      await performImport(path)
    } catch (err) {
      // rollback - clear up failed import and re-import the pre-backup
      await removeExistingApp(devAppId)
      await performImport(backupTarPath)
    }
    fs.rmSync(backupTarPath)
  })
}

async function exportProcessor(job: Job) {
  const data: AppBackupQueueData = job.data
  const appId = data.appId,
    trigger = data.export!.trigger,
    name = data.export!.name
  const tenantId = tenancy.getTenantIDFromAppID(appId)
  await tenancy.doInTenant(tenantId, async () => {
    const createdAt = new Date().toISOString()
    const tarPath = await exportApp(appId, { tar: true })
    let filename = `${appId}/backup-${createdAt}.tar.gz`
    // add the tenant to the bucket path if backing up within a multi-tenant environment
    if (env.MULTI_TENANCY) {
      filename = `${tenantId}/${filename}`
    }
    const bucket = objectStore.ObjectStoreBuckets.BACKUPS
    const metadata = {
      appId,
      createdAt,
      trigger,
      name,
    }
    await objectStore.upload({
      path: tarPath,
      type: "application/gzip",
      bucket,
      filename,
      metadata,
    })
    await backups.storeAppBackupMetadata(filename, metadata)
    // clear up the tarball after uploading it
    fs.rmSync(tarPath)
  })
}

export async function init() {
  await backups.addAppBackupProcessors(importProcessor, exportProcessor)
}

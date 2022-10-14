import { backups } from "@budibase/pro"
import { objectStore, tenancy } from "@budibase/backend-core"
import { exportApp } from "./exports"
import { Job } from "bull"
import fs from "fs"
import env from "../../../environment"

export async function init() {
  await backups.addAppBackupProcessor(async (job: Job) => {
    const appId = job.data.appId,
      trigger = job.data.trigger,
      name = job.data.name
    const createdAt = new Date().toISOString()
    const tarPath = await exportApp(appId, { tar: true })
    let filename = `${appId}/backup-${createdAt}.tar.gz`
    // add the tenant to the bucket path if backing up within a multi-tenant environment
    if (env.MULTI_TENANCY) {
      const tenantId = tenancy.getTenantIDFromAppID(appId)
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

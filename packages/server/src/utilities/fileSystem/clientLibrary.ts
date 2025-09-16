import { objectStore } from "@budibase/backend-core"
import { sdk, utils } from "@budibase/shared-core"
import fs from "fs"
import path, { join } from "path"
import { ObjectStoreBuckets } from "../../constants"
import env from "../../environment"
import { resolve } from "../centralPath"
import { TOP_LEVEL_PATH } from "./filesystem"

export function devClientLibPath() {
  return require.resolve("@budibase/client")
}

/**
 * Client library paths in the object store:
 * Previously, the entire client library package was downloaded from NPM
 * as a tarball and extracted to the object store, even though only the manifest
 * was ever needed. Therefore we need to support old apps which may still have
 * the manifest at this location for the first update.
 *
 * The paths for the in-use version are:
 * {appId}/manifest.json
 * {appId}/budibase-client.js
 * {appId}/_dependencies/...
 * {appId}/... (and any other app files)
 *
 * The paths for the backups are:
 * {appId}/.bak/manifest.json
 * {appId}/.bak/budibase-client.js
 * {appId}/.bak/_dependencies/...
 * {appId}/.bak/... (complete folder backup)
 *
 * We don't rely on NPM at all any more, as when updating to the latest version
 * we pull both the manifest and client bundle from the server's dependencies
 * in the local file system.
 */

/**
 * Backs up the current client library version by copying the entire app folder
 * to a backup location in the object store. Only the one previous version is
 * stored as a backup, which can be reverted to.
 * @param appId The app ID to backup
 * @returns {Promise<void>}
 */
export async function backupClientLibrary(appId: string) {
  appId = sdk.applications.getProdAppID(appId)
  // First, remove any existing backup folder
  try {
    await objectStore.deleteFolder(ObjectStoreBuckets.APPS, `${appId}/.bak`)
  } catch (error) {
    // Ignore errors if backup doesn't exist
  }

  await forEachObject(appId, async fileKey => {
    if (fileKey.includes("/.bak/") || fileKey.endsWith(".bak")) {
      return
    }

    const tmpPath = await objectStore.retrieveToTmp(
      ObjectStoreBuckets.APPS,
      fileKey
    )

    const backupKey = fileKey.replace(appId, `${appId}/.bak`)
    await objectStore.upload({
      bucket: ObjectStoreBuckets.APPS,
      filename: backupKey,
      path: tmpPath,
    })
  })
}

/**
 * Uploads the latest version of the component manifest and the client library
 * to the object store, overwriting the existing version.
 * @param appId The app ID to update
 * @returns {Promise<void>}
 */
export async function updateClientLibrary(appId: string) {
  let manifest, client

  if (env.isDev()) {
    const clientPath = devClientLibPath()
    // Load the symlinked version in dev which is always the newest
    manifest = join(path.dirname(path.dirname(clientPath)), "manifest.json")
    client = clientPath
  } else {
    // Load the bundled version in prod
    manifest = resolve(TOP_LEVEL_PATH, "client", "manifest.json")
    client = resolve(TOP_LEVEL_PATH, "client", "budibase-client.js")
  }

  // Upload latest manifest and client library
  const manifestUpload = objectStore.streamUpload({
    bucket: ObjectStoreBuckets.APPS,
    filename: join(appId, "manifest.json"),
    stream: fs.createReadStream(manifest),
  })
  const clientUpload = objectStore.streamUpload({
    bucket: ObjectStoreBuckets.APPS,
    filename: join(appId, "budibase-client.js"),
    stream: fs.createReadStream(client),
  })

  const manifestSrc = fs.promises.readFile(manifest, "utf8")

  await Promise.all([manifestUpload, clientUpload, manifestSrc])

  return JSON.parse(await manifestSrc)
}

/**
 * Reverts the version of the client library and manifest to the previously
 * used version for an app by restoring the entire backed up folder.
 * @param appId The app ID to revert
 * @returns {Promise<void>}
 */
export async function revertClientLibrary(appId: string) {
  appId = sdk.applications.getProdAppID(appId)

  let manifestContent
  let hasBackup = false
  const restoredFiles = new Set<string>()

  // First, restore all files from the backup folder
  await forEachObject(`${appId}/.bak`, async filePath => {
    hasBackup = true

    // Download the backup file to temp
    const tmpPath = await objectStore.retrieveToTmp(
      ObjectStoreBuckets.APPS,
      filePath
    )

    // Restore to original location
    const restoreKey = filePath.replace(`${appId}/.bak`, appId)
    restoredFiles.add(restoreKey)

    // Read manifest content if this is the manifest file
    if (restoreKey.endsWith("manifest.json")) {
      manifestContent = await fs.promises.readFile(tmpPath, "utf8")
    }

    await objectStore.upload({
      bucket: ObjectStoreBuckets.APPS,
      filename: restoreKey,
      path: tmpPath,
    })
  })

  // After successful restore, clean up any extra files that weren't in backup
  if (hasBackup) {
    await forEachObject(appId, async filePath => {
      if (
        !filePath.includes("/.bak/") &&
        !filePath.endsWith(".bak") &&
        !restoredFiles.has(filePath)
      ) {
        await objectStore.deleteFile(ObjectStoreBuckets.APPS, filePath)
      }
    })
  }

  // If no backup folder found, try to find old .bak files
  if (!hasBackup) {
    await forEachObject(appId, async filePath => {
      if (!filePath.endsWith(".bak")) {
        return
      }

      hasBackup = true

      // Restore .bak file to original location
      const restoreKey = filePath.replace(".bak", "")

      // For manifest file, we need to read the content to return it

      if (restoreKey.endsWith("manifest.json")) {
        const tmpPath = await objectStore.retrieveToTmp(
          ObjectStoreBuckets.APPS,
          filePath
        )
        manifestContent = await fs.promises.readFile(tmpPath, "utf8")
      }

      // For all other files, use streaming
      const stream = await objectStore.getReadStream(
        ObjectStoreBuckets.APPS,
        filePath
      )

      await objectStore.streamUpload({
        bucket: ObjectStoreBuckets.APPS,
        filename: restoreKey,
        stream,
      })
    })
  }

  if (!hasBackup) {
    throw new Error(`No backup found for app ${appId}`)
  }

  if (!manifestContent) {
    throw new Error(`No manifest found in backup for app ${appId}`)
  }

  return JSON.parse(manifestContent)
}

const forEachObject = (
  path: string,
  task: (fileKey: string) => Promise<void>
) =>
  utils.parallelForeach(
    objectStore.listAllObjects(ObjectStoreBuckets.APPS, path),
    async file => {
      if (!file.Key) {
        throw new Error("file.Key must be defined")
      }
      await task(file.Key)
    },
    5
  )

export function shouldServeLocally() {
  if (env.isDev()) {
    if (env.DEV_USE_CLIENT_FROM_STORAGE) {
      return false
    }
    return true
  }

  if (env.isTest()) {
    return true
  }

  return false
}

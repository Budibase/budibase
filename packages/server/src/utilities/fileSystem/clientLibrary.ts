import path, { join } from "path"
import { ObjectStoreBuckets } from "../../constants"
import fs from "fs"
import { objectStore } from "@budibase/backend-core"
import { resolve } from "../centralPath"
import env from "../../environment"
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
 * The new paths for the in-use version are:
 * {appId}/manifest.json
 * {appId}/budibase-client.js
 *
 * The paths for the backups are:
 * {appId}/manifest.json.bak
 * {appId}/budibase-client.js.bak
 *
 * We don't rely on NPM at all any more, as when updating to the latest version
 * we pull both the manifest and client bundle from the server's dependencies
 * in the local file system.
 */

/**
 * Backs up the current client library version by copying both the manifest
 * and client bundle to .bak extensions in the object store. Only the one
 * previous version is stored as a backup, which can be reverted to.
 * @param appId The app ID to backup
 * @returns {Promise<void>}
 */
export async function backupClientLibrary(appId: string) {
  // Copy existing manifest to tmp
  let tmpManifestPath
  try {
    // Try to load the manifest from the new file location
    tmpManifestPath = await objectStore.retrieveToTmp(
      ObjectStoreBuckets.APPS,
      join(appId, "manifest.json")
    )
  } catch (error) {
    // Fallback to loading it from the old location for old apps
    tmpManifestPath = await objectStore.retrieveToTmp(
      ObjectStoreBuckets.APPS,
      join(
        appId,
        "node_modules",
        "budibase",
        "standard-components",
        "package",
        "manifest.json"
      )
    )
  }

  // Copy existing client lib to tmp
  const tmpClientPath = await objectStore.retrieveToTmp(
    ObjectStoreBuckets.APPS,
    join(appId, "budibase-client.js")
  )

  // Upload manifest and client library as backups
  const manifestUpload = objectStore.upload({
    bucket: ObjectStoreBuckets.APPS,
    filename: join(appId, "manifest.json.bak"),
    path: tmpManifestPath,
    type: "application/json",
  })
  const clientUpload = objectStore.upload({
    bucket: ObjectStoreBuckets.APPS,
    filename: join(appId, "budibase-client.js.bak"),
    path: tmpClientPath,
    type: "application/javascript",
  })
  await Promise.all([manifestUpload, clientUpload])
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
  const manifestUpload = objectStore.streamUpload(
    ObjectStoreBuckets.APPS,
    join(appId, "manifest.json"),
    fs.createReadStream(manifest),
    {
      ContentType: "application/json",
    }
  )
  const clientUpload = objectStore.streamUpload(
    ObjectStoreBuckets.APPS,
    join(appId, "budibase-client.js"),
    fs.createReadStream(client),
    {
      ContentType: "application/javascript",
    }
  )
  await Promise.all([manifestUpload, clientUpload])
}

/**
 * Reverts the version of the client library and manifest to the previously
 * used version for an app.
 * @param appId The app ID to revert
 * @returns {Promise<void>}
 */
export async function revertClientLibrary(appId: string) {
  // Copy backups manifest to tmp directory
  const tmpManifestPath = await objectStore.retrieveToTmp(
    ObjectStoreBuckets.APPS,
    join(appId, "manifest.json.bak")
  )

  // Copy backup client lib to tmp
  const tmpClientPath = await objectStore.retrieveToTmp(
    ObjectStoreBuckets.APPS,
    join(appId, "budibase-client.js.bak")
  )

  // Upload backups as new versions
  const manifestUpload = objectStore.upload({
    bucket: ObjectStoreBuckets.APPS,
    filename: join(appId, "manifest.json"),
    path: tmpManifestPath,
    type: "application/json",
  })
  const clientUpload = objectStore.upload({
    bucket: ObjectStoreBuckets.APPS,
    filename: join(appId, "budibase-client.js"),
    path: tmpClientPath,
    type: "application/javascript",
  })
  await Promise.all([manifestUpload, clientUpload])
}

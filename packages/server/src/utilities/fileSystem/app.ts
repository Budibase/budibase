import { budibaseTempDir } from "../budibaseDir"
import fs from "fs"
import { join } from "path"
import { ObjectStoreBuckets } from "../../constants"
import { updateClientLibrary } from "./clientLibrary"
import env from "../../environment"
import { objectStore, context } from "@budibase/backend-core"
import { TOP_LEVEL_PATH } from "./filesystem"

export const NODE_MODULES_PATH = join(TOP_LEVEL_PATH, "node_modules")

/**
 * Uploads the latest client library to the object store.
 * @param {string} appId The ID of the app which is being created.
 * @return {Promise<void>} once promise completes app resources should be ready in object store.
 */
export const createApp = async (appId: string) => {
  await updateClientLibrary(appId)
}

/**
 * Removes all of the assets created for an app in the object store.
 * @param {string} appId The ID of the app which is being deleted.
 * @return {Promise<void>} once promise completes the app resources will be removed from object store.
 */
export const deleteApp = async (appId: string) => {
  await objectStore.deleteFolder(ObjectStoreBuckets.APPS, `${appId}/`)
}

/**
 * Retrieves component libraries from object store (or tmp symlink if in local)
 */
export const getComponentLibraryManifest = async (library: string) => {
  const appId = context.getAppId()
  const filename = "manifest.json"
  /* istanbul ignore next */
  // when testing in cypress and so on we need to get the package
  // as the environment may not be fully fleshed out for dev or prod
  if (env.isTest()) {
    library = library.replace("standard-components", "client")
    const lib = library.split("/")[1]
    const path = require.resolve(library).split(lib)[0]
    return require(join(path, lib, filename))
  } else if (env.isDev()) {
    const path = join(NODE_MODULES_PATH, "@budibase", "client", filename)
    // always load from new so that updates are refreshed
    delete require.cache[require.resolve(path)]
    return require(path)
  }

  if (!appId) {
    throw new Error("No app ID found - cannot get component libraries")
  }

  let resp
  let path
  try {
    // Try to load the manifest from the new file location
    path = join(appId, filename)
    resp = await objectStore.retrieve(ObjectStoreBuckets.APPS, path)
  } catch (error) {
    console.error(
      `component-manifest-objectstore=failed appId=${appId} path=${path}`,
      error
    )
    // Fallback to loading it from the old location for old apps
    path = join(appId, "node_modules", library, "package", filename)
    resp = await objectStore.retrieve(ObjectStoreBuckets.APPS, path)
  }
  if (typeof resp !== "string") {
    resp = resp.toString("utf8")
  }
  return JSON.parse(resp)
}

/**
 * Given a set of app IDs makes sure file system is cleared of any of their temp info.
 */
export const cleanup = (appIds: string[]) => {
  for (let appId of appIds) {
    const path = join(budibaseTempDir(), appId)
    if (fs.existsSync(path)) {
      fs.rmdirSync(path, { recursive: true })
    }
  }
}

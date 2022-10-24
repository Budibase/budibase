import { exportDB } from "./db"
const { budibaseTempDir } = require("../budibaseDir")
const fs = require("fs")
const { join } = require("path")
import { ObjectStoreBuckets } from "../../constants"
const { updateClientLibrary } = require("./clientLibrary")
const env = require("../../environment")
const {
  USER_METDATA_PREFIX,
  LINK_USER_METADATA_PREFIX,
  TABLE_ROW_PREFIX,
} = require("../../db/utils")
const { getAppId } = require("@budibase/backend-core/context")
import { objectStore } from "@budibase/backend-core"
import { Document } from "@budibase/types"
import { TOP_LEVEL_PATH } from "./filesystem"

export const NODE_MODULES_PATH = join(TOP_LEVEL_PATH, "node_modules")

/**
 * Local utility to back up the database state for an app, excluding global user
 * data or user relationships.
 * @param {string} appId The app to backup
 * @param {object} config Config to send to export DB
 * @param {boolean} excludeRows Flag to state whether the export should include data.
 * @returns {*} either a string or a stream of the backup
 */
const backupAppData = async (
  appId: string,
  config: any,
  excludeRows?: boolean
) => {
  return await exportDB(appId, {
    ...config,
    filter: defineFilter(excludeRows),
  })
}

/**
 * Takes a copy of the database state for an app to the object store.
 * @param {string} appId The ID of the app which is to be backed up.
 * @param {string} backupName The name of the backup located in the object store.
 * @return {*} a readable stream to the completed backup file
 */
export const performBackup = async (appId: string, backupName: string) => {
  return await backupAppData(appId, { exportName: backupName })
}

/**
 * Streams a backup of the database state for an app
 * @param {string} appId The ID of the app which is to be backed up.
 * @param {boolean} excludeRows Flag to state whether the export should include data.
 * @returns {*} a readable stream of the backup which is written in real time
 */
export const streamBackup = async (appId: string, excludeRows: boolean) => {
  return await backupAppData(appId, { stream: true }, excludeRows)
}

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
  const appId = getAppId()
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

export const defineFilter = (excludeRows?: boolean) => {
  const ids = [USER_METDATA_PREFIX, LINK_USER_METADATA_PREFIX]
  if (excludeRows) {
    ids.push(TABLE_ROW_PREFIX)
  }
  return (doc: Document) =>
    !ids.map(key => doc._id!.includes(key)).reduce((prev, curr) => prev || curr)
}

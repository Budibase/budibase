const env = require("../environment")
const { DocumentTypes, SEPARATOR } = require("../db/utils")
const CouchDB = require("../db")
const { OBJ_STORE_DIRECTORY, ObjectStoreBuckets } = require("../constants")

const BB_CDN = "https://cdn.app.budi.live/assets"
const APP_PREFIX = DocumentTypes.APP + SEPARATOR

exports.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

exports.isDev = env.isDev

/**
 * Lots of different points in the app need to find the full list of apps, this will
 * enumerate the entire CouchDB cluster and get the list of databases (every app).
 * NOTE: this operation is fine in self hosting, but cannot be used when hosting many
 * different users/companies apps as there is no security around it - all apps are returned.
 * @return {Promise<object[]>} returns the app information document stored in each app database.
 */
exports.getAllApps = async () => {
  let allDbs = await CouchDB.allDbs()
  const appDbNames = allDbs.filter((dbName) => dbName.startsWith(APP_PREFIX))
  const appPromises = appDbNames.map((db) => new CouchDB(db).get(db))
  if (appPromises.length === 0) {
    return []
  } else {
    const response = await Promise.allSettled(appPromises)
    return response
      .filter((result) => result.status === "fulfilled")
      .map(({ value }) => value)
  }
}

/**
 * Makes sure that a URL has the correct number of slashes, while maintaining the
 * http(s):// double slashes.
 * @param {string} url The URL to test and remove any extra double slashes.
 * @return {string} The updated url.
 */
exports.checkSlashesInUrl = (url) => {
  return url.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
}

/**
 * Gets the address of the object store, depending on whether self hosted or in cloud.
 * @return {string} The base URL of the object store (MinIO or S3).
 */
exports.objectStoreUrl = () => {
  if (env.SELF_HOSTED) {
    // can use a relative url for this as all goes through the proxy (this is hosted in minio)
    return OBJ_STORE_DIRECTORY
  } else {
    return BB_CDN
  }
}

/**
 * In production the client library is stored in the object store, however in development
 * we use the symlinked version produced by lerna, located in node modules. We link to this
 * via a specific endpoint (under /api/assets/client).
 * @param {string} appId In production we need the appId to look up the correct bucket, as the
 * version of the client lib may differ between apps.
 * @return {string} The URL to be inserted into appPackage response or server rendered
 * app index file.
 */
exports.clientLibraryPath = (appId) => {
  if (env.isProd()) {
    return `${exports.objectStoreUrl()}/${appId}/budibase-client.js`
  } else {
    return `/api/assets/client`
  }
}

exports.attachmentsRelativeURL = (attachmentKey) => {
  return exports.checkSlashesInUrl(
    `/${ObjectStoreBuckets.APPS}/${attachmentKey}`
  )
}

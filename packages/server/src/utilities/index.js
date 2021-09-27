const env = require("../environment")
const { OBJ_STORE_DIRECTORY } = require("../constants")
const { sanitizeKey } = require("@budibase/auth/src/objectStore")
const CouchDB = require("../db")
const { generateMetadataID } = require("../db/utils")

const BB_CDN = "https://cdn.budi.live"

exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.isDev = env.isDev

/**
 * Makes sure that a URL has the correct number of slashes, while maintaining the
 * http(s):// double slashes.
 * @param {string} url The URL to test and remove any extra double slashes.
 * @return {string} The updated url.
 */
exports.checkSlashesInUrl = url => {
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
exports.clientLibraryPath = appId => {
  if (env.isProd()) {
    return `${exports.objectStoreUrl()}/${sanitizeKey(
      appId
    )}/budibase-client.js`
  } else {
    return `/api/assets/client`
  }
}

exports.attachmentsRelativeURL = attachmentKey => {
  return exports.checkSlashesInUrl(
    `${exports.objectStoreUrl()}/${attachmentKey}`
  )
}

exports.updateEntityMetadata = async (appId, type, entityId, updateFn) => {
  const db = new CouchDB(appId)
  const id = generateMetadataID(type, entityId)
  // read it to see if it exists, we'll overwrite it no matter what
  let rev,
    metadata = {}
  try {
    const oldMetadata = await db.get(id)
    rev = oldMetadata._rev
    metadata = updateFn(oldMetadata)
  } catch (err) {
    rev = null
    metadata = updateFn({})
  }
  metadata._id = id
  if (rev) {
    metadata._rev = rev
  }
  const response = await db.put(metadata)
  return {
    ...metadata,
    _id: id,
    _rev: response.rev,
  }
}

exports.saveEntityMetadata = async (appId, type, entityId, metadata) => {
  return exports.updateEntityMetadata(appId, type, entityId, () => {
    return metadata
  })
}

exports.deleteEntityMetadata = async (appId, type, entityId) => {
  const db = new CouchDB(appId)
  const id = generateMetadataID(type, entityId)
  let rev
  try {
    const metadata = await db.get(id)
    if (metadata) {
      rev = metadata._rev
    }
  } catch (err) {
    // don't need to error if it doesn't exist
  }
  if (id && rev) {
    await db.remove(id, rev)
  }
}

exports.escapeDangerousCharacters = string => {
  return string
    .replace(/[\\]/g, "\\\\")
    .replace(/[\b]/g, "\\b")
    .replace(/[\f]/g, "\\f")
    .replace(/[\n]/g, "\\n")
    .replace(/[\r]/g, "\\r")
    .replace(/[\t]/g, "\\t")
}

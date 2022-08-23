const redis = require("../redis/init")
const { doWithDB } = require("../db")
const { DocumentType } = require("../db/constants")

const AppState = {
  INVALID: "invalid",
}
const EXPIRY_SECONDS = 3600

/**
 * The default populate app metadata function
 */
const populateFromDB = async appId => {
  return doWithDB(
    appId,
    db => {
      return db.get(DocumentType.APP_METADATA)
    },
    { skip_setup: true }
  )
}

const isInvalid = metadata => {
  return !metadata || metadata.state === AppState.INVALID
}

/**
 * Get the requested app metadata by id.
 * Use redis cache to first read the app metadata.
 * If not present fallback to loading the app metadata directly and re-caching.
 * @param {string} appId the id of the app to get metadata from.
 * @returns {object} the app metadata.
 */
exports.getAppMetadata = async appId => {
  const client = await redis.getAppClient()
  // try cache
  let metadata = await client.get(appId)
  if (!metadata) {
    let expiry = EXPIRY_SECONDS
    try {
      metadata = await populateFromDB(appId)
    } catch (err) {
      // app DB left around, but no metadata, it is invalid
      if (err && err.status === 404) {
        metadata = { state: AppState.INVALID }
        // don't expire the reference to an invalid app, it'll only be
        // updated if a metadata doc actually gets stored (app is remade/reverted)
        expiry = undefined
      } else {
        throw err
      }
    }
    // needed for cypress/some scenarios where the caching happens
    // so quickly the requests can get slightly out of sync
    // might store its invalid just before it stores its valid
    if (isInvalid(metadata)) {
      const temp = await client.get(appId)
      if (temp) {
        metadata = temp
      }
    }
    await client.store(appId, metadata, expiry)
  }
  // we've stored in the cache an object to tell us that it is currently invalid
  if (isInvalid(metadata)) {
    throw { status: 404, message: "No app metadata found" }
  }
  return metadata
}

/**
 * Invalidate/reset the cached metadata when a change occurs in the db.
 * @param appId {string} the cache key to bust/update.
 * @param newMetadata {object|undefined} optional - can simply provide the new metadata to update with.
 * @return {Promise<void>} will respond with success when cache is updated.
 */
exports.invalidateAppMetadata = async (appId, newMetadata = null) => {
  if (!appId) {
    throw "Cannot invalidate if no app ID provided."
  }
  const client = await redis.getAppClient()
  await client.delete(appId)
  if (newMetadata) {
    await client.store(appId, newMetadata, EXPIRY_SECONDS)
  }
}

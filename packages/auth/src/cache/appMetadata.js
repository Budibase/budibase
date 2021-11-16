const redis = require("../redis/authRedis")
const { getCouch } = require("../db")
const { DocumentTypes } = require("../db/constants")

const AppState = {
  INVALID: "invalid",
}
const EXPIRY_SECONDS = 3600

/**
 * The default populate app metadata function
 */
const populateFromDB = async (appId, CouchDB = null) => {
  if (!CouchDB) {
    CouchDB = getCouch()
  }
  const db = new CouchDB(appId, { skip_setup: true })
  return db.get(DocumentTypes.APP_METADATA)
}

/**
 * Get the requested app metadata by id.
 * Use redis cache to first read the app metadata.
 * If not present fallback to loading the app metadata directly and re-caching.
 * @param {*} appId the id of the app to get metadata from.
 * @returns {object} the app metadata.
 */
exports.getAppMetadata = async (appId, CouchDB = null) => {
  const client = await redis.getAppClient()
  // try cache
  let metadata = await client.get(appId)
  if (!metadata) {
    let expiry = EXPIRY_SECONDS
    try {
      metadata = await populateFromDB(appId, CouchDB)
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
    await client.store(appId, metadata, expiry)
  }
  // we've stored in the cache an object to tell us that it is currently invalid
  if (!metadata || metadata.state === AppState.INVALID) {
    throw { status: 404, message: "No app metadata found" }
  }
  return metadata
}

exports.invalidateAppMetadata = async appId => {
  const client = await redis.getAppClient()
  await client.delete(appId)
}

const redis = require("../redis/authRedis")
const { getCouch } = require("../db")
const { DocumentTypes } = require("../db/constants")

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
    metadata = await populateFromDB(appId, CouchDB)
    client.store(appId, metadata, EXPIRY_SECONDS)
  }
  return metadata
}

exports.invalidateAppMetadata = async appId => {
  const client = await redis.getAppClient()
  await client.delete(appId)
}

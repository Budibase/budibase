const CouchDB = require("./index")
const { StaticDatabases } = require("./utils")
const env = require("../environment")

const SELF_HOST_ERR = "Unable to access builder DB/doc - not self hosted."
const BUILDER_DB = StaticDatabases.BUILDER

/**
 * This is the builder database, right now this is a single, static database
 * that is present across the whole system and determines some core functionality
 * for the builder (e.g. storage of API keys). This has been limited to self hosting
 * as it doesn't make as much sense against the currently design Cloud system.
 */

exports.getBuilderMainDoc = async () => {
  if (!env.SELF_HOSTED) {
    throw SELF_HOST_ERR
  }
  const db = new CouchDB(BUILDER_DB.name)
  try {
    return await db.get(BUILDER_DB.baseDoc)
  } catch (err) {
    // doesn't exist yet, nothing to get
    return {
      _id: BUILDER_DB.baseDoc,
    }
  }
}

exports.setBuilderMainDoc = async doc => {
  if (!env.SELF_HOSTED) {
    throw SELF_HOST_ERR
  }
  // make sure to override the ID
  doc._id = BUILDER_DB.baseDoc
  const db = new CouchDB(BUILDER_DB.name)
  return db.put(doc)
}

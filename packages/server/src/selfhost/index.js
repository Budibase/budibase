const CouchDB = require("../db")
const env = require("../environment")
const newid = require("../db/newid")

const SELF_HOST_DB = "self-host-db"
const SELF_HOST_DOC = "self-host-info"

async function createSelfHostDB(db) {
  await db.put({
    _id: "_design/database",
    views: {},
  })
  const selfHostInfo = {
    _id: SELF_HOST_DOC,
    apiKeyId: newid(),
  }
  await db.put(selfHostInfo)
  return selfHostInfo
}

exports.init = async () => {
  if (!env.SELF_HOSTED) {
    return
  }
  const db = new CouchDB(SELF_HOST_DB)
  try {
    await db.get(SELF_HOST_DOC)
  } catch (err) {
    // failed to retrieve
    if (err.status === 404) {
      await createSelfHostDB(db)
    }
  }
}

exports.getSelfHostInfo = async () => {
  const db = new CouchDB(SELF_HOST_DB)
  return db.get(SELF_HOST_DOC)
}

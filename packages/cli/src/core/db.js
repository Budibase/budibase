const PouchDB = require("pouchdb")
const { checkSlashesInUrl } = require("../utils")
const fetch = require("node-fetch")

/**
 * Fully qualified URL including username and password, or nothing for local
 */
exports.getPouch = (url = undefined) => {
  let POUCH_DB_DEFAULTS = {}
  if (!url) {
    POUCH_DB_DEFAULTS = {
      prefix: undefined,
      adapter: "leveldb",
    }
  } else {
    POUCH_DB_DEFAULTS = {
      prefix: url,
    }
  }
  const replicationStream = require("pouchdb-replication-stream")
  PouchDB.plugin(replicationStream.plugin)
  PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)
  return PouchDB.defaults(POUCH_DB_DEFAULTS)
}

exports.getAllDbs = async url => {
  const response = await fetch(
    checkSlashesInUrl(encodeURI(`${url}/_all_dbs`)),
    {
      method: "GET",
    }
  )
  if (response.status === 200) {
    return await response.json()
  } else {
    throw "Cannot connect to CouchDB instance"
  }
}

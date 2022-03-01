const PouchDB = require("pouchdb")
const { getCouchUrl } = require("@budibase/backend-core/db")
const replicationStream = require("pouchdb-replication-stream")
const allDbs = require("pouchdb-all-dbs")
const find = require("pouchdb-find")
const env = require("../environment")

const COUCH_DB_URL = getCouchUrl() || "http://localhost:4005"

PouchDB.plugin(replicationStream.plugin)
PouchDB.plugin(find)
PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)

let POUCH_DB_DEFAULTS = {
  prefix: COUCH_DB_URL,
}

if (env.isTest()) {
  PouchDB.plugin(require("pouchdb-adapter-memory"))
  POUCH_DB_DEFAULTS = {
    prefix: undefined,
    adapter: "memory",
  }
}

const Pouch = PouchDB.defaults(POUCH_DB_DEFAULTS)

// have to still have pouch alldbs for testing
allDbs(Pouch)

module.exports = Pouch

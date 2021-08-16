const PouchDB = require("pouchdb")
const replicationStream = require("pouchdb-replication-stream")
const allDbs = require("pouchdb-all-dbs")
const find = require("pouchdb-find")
const env = require("../environment")

const COUCH_DB_URL = env.COUCH_DB_URL || "http://localhost:10000/db/"

PouchDB.plugin(replicationStream.plugin)
PouchDB.plugin(find)
PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)

let POUCH_DB_DEFAULTS = {
  prefix: COUCH_DB_URL,
  auth: {
    username: env.COUCH_DB_USERNAME,
    password: env.COUCH_DB_PASSWORD,
  }
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

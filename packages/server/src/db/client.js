const PouchDB = require("pouchdb")
const replicationStream = require("pouchdb-replication-stream")
const allDbs = require("pouchdb-all-dbs")
const { budibaseAppsDir } = require("../utilities/budibaseDir")
const env = require("../environment")

const COUCH_DB_URL = env.COUCH_DB_URL || `leveldb://${budibaseAppsDir()}/.data/`
const isInMemory = env.NODE_ENV === "jest"

PouchDB.plugin(replicationStream.plugin)
PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)

let POUCH_DB_DEFAULTS = {
  prefix: COUCH_DB_URL,
  skip_setup: !!env.CLOUD,
}

if (isInMemory) {
  PouchDB.plugin(require("pouchdb-adapter-memory"))
  POUCH_DB_DEFAULTS = {
    prefix: undefined,
    adapter: "memory",
  }
}

const Pouch = PouchDB.defaults(POUCH_DB_DEFAULTS)

allDbs(Pouch)

// replicate your local levelDB pouch to a running HTTP compliant couch or pouchdb server.
// eslint-disable-next-line no-unused-vars
function replicateLocal() {
  Pouch.allDbs().then(dbs => {
    for (let db of dbs) {
      new Pouch(db).sync(
        new PouchDB(`http://127.0.0.1:5984/${db}`, { live: true })
      )
    }
  })
}

// replicateLocal()

module.exports = Pouch

const PouchDB = require("pouchdb")
const allDbs = require("pouchdb-all-dbs")
const { budibaseAppsDir } = require("../utilities/budibaseDir")
const env = require("../environment")

const COUCH_DB_URL = env.COUCH_DB_URL || `leveldb://${budibaseAppsDir()}/`
const isInMemory = env.NODE_ENV === "jest"

if (isInMemory) PouchDB.plugin(require("pouchdb-adapter-memory"))

const Pouch = PouchDB.defaults({
  prefix: isInMemory ? undefined : COUCH_DB_URL,
  adapter: isInMemory ? "memory" : undefined,
})

allDbs(Pouch)

module.exports = Pouch

const PouchDB = require("pouchdb")
const allDbs = require("pouchdb-all-dbs")
const env = require("../environment")
const { join } = require("path")
const { homedir } = require("os")

// level option is purely for testing (development)
const COUCH_DB_URL = env.COUCH_DB_URL || `leveldb://${join(homedir(), ".budibase")}/.data/`

const Pouch = PouchDB.defaults({
  prefix: COUCH_DB_URL,
})

allDbs(Pouch)

module.exports = Pouch
const PouchDB = require("pouchdb")
const allDbs = require("pouchdb-all-dbs")
const env = require("../environment")

// level option is purely for testing (development)
const COUCH_DB_URL = env.COUCH_DB_URL || "http://localhost:10000/db/"

const Pouch = PouchDB.defaults({
  prefix: COUCH_DB_URL,
})

allDbs(Pouch)

module.exports = Pouch

const PouchDB = require("pouchdb")
const allDbs = require("pouchdb-all-dbs")
const { budibaseAppsDir } = require("../utilities/budibaseDir")

const COUCH_DB_URL = process.env.COUCH_DB_URL || `leveldb://${budibaseAppsDir()}/`

const Pouch = PouchDB.defaults({
  prefix: COUCH_DB_URL,
})

allDbs(Pouch)

module.exports = Pouch

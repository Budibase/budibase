const PouchDB = require("pouchdb")
const env = require("../environment")

// level option is purely for testing (development)
const COUCH_DB_URL =
  env.COUCH_DB_URL || "http://budibase:budibase@localhost:10000/db/"

const Pouch = PouchDB.defaults({
  prefix: COUCH_DB_URL,
})

module.exports = Pouch

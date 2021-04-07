const PouchDB = require("pouchdb")

// level option is purely for testing (development)
const COUCH_DB_URL =
  process.env.COUCH_DB_URL || "http://budibase:budibase@localhost:10000/db/"

const Pouch = PouchDB.defaults({
  prefix: COUCH_DB_URL,
})

module.exports = Pouch

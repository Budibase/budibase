const PouchDB = require("pouchdb")
require("pouchdb-all-dbs")(PouchDB)

module.exports = () => {
  const COUCH_DB_URL =
    process.env.COUCH_DB_URL || "http://admin:password@localhost:5984"
  const DATABASE_TYPE = process.env.DATABASE_TYPE || "couch"

  PouchDB.defaults({
    prefix: COUCH_DB_URL,
  })

  return PouchDB
}

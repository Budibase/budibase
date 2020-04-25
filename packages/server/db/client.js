const PouchDB = require("pouchdb")
const allDbs = require("pouchdb-all-dbs")

module.exports = () => {
  const COUCH_DB_URL =
    process.env.COUCH_DB_URL || "http://admin:password@localhost:5984"
  const DATABASE_TYPE = process.env.DATABASE_TYPE || "couch"

  const pouch =  PouchDB.defaults({
    prefix: COUCH_DB_URL,
  })
  allDbs(pouch)
  return pouch
}

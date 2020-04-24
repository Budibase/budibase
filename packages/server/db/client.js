// const nano = require("nano")
const PouchDB = require("pouchdb")

const COUCH_DB_URL =
  process.env.COUCH_DB_URL || "http://admin:password@localhost:5984"

// database can be "pouch" or "couch"
const CouchDB = ({ database, couchDbConnectionString }) => {
  database = database || "couch"
  couchDbConnectionString = couchDbConnectionString || COUCH_DB_URL
  if (database === "couch") {
    return PouchDB.defaults({
      prefix: couchDbConnectionString,
    })
  }
  // else setup for leveldb
}

module.exports = CouchDB

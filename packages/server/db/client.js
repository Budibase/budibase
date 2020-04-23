// const nano = require("nano")
const PouchDB = require("pouchdb");

const COUCH_DB_URL =
  process.env.COUCH_DB_URL || "http://admin:password@localhost:5984"

const CouchDB = PouchDB.defaults({
  prefix: COUCH_DB_URL 
});

module.exports = CouchDB; 

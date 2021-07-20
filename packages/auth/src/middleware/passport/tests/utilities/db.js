const PouchDB = require("pouchdb")
const allDbs = require("pouchdb-all-dbs")
const env = require("../../../../environment")

let POUCH_DB_DEFAULTS

// should always be test but good to do the sanity check
if (env.isTest()) {
  PouchDB.plugin(require("pouchdb-adapter-memory"))
  POUCH_DB_DEFAULTS = {
    prefix: undefined,
    adapter: "memory",
  }
}

const Pouch = PouchDB.defaults(POUCH_DB_DEFAULTS)

allDbs(Pouch)

module.exports = Pouch

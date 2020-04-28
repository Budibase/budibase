const PouchDB = require("pouchdb")
const allDbs = require("pouchdb-all-dbs")
const os = require("os");
const path = require("path");

const BUDIBASE_DIR = path.join(os.homedir(), ".budibase");

const COUCH_DB_URL = process.env.COUCH_DB_URL || `leveldb://${BUDIBASE_DIR}/`;
const DATABASE_TYPE = process.env.DATABASE_TYPE || "couch";

const Pouch = PouchDB.defaults({
  prefix: COUCH_DB_URL,
});

allDbs(Pouch);

module.exports = Pouch;

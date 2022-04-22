const PouchDB = require("pouchdb")
const env = require("../environment")

exports.getCouchUrl = () => {
  if (!env.COUCH_DB_URL) return

  // username and password already exist in URL
  if (env.COUCH_DB_URL.includes("@")) {
    return env.COUCH_DB_URL
  }

  const [protocol, ...rest] = env.COUCH_DB_URL.split("://")

  if (!env.COUCH_DB_USERNAME || !env.COUCH_DB_PASSWORD) {
    throw new Error(
      "CouchDB configuration invalid. You must provide a fully qualified CouchDB url, or the COUCH_DB_USER and COUCH_DB_PASSWORD environment variables."
    )
  }

  return `${protocol}://${env.COUCH_DB_USERNAME}:${env.COUCH_DB_PASSWORD}@${rest}`
}

/**
 * Return a constructor for PouchDB.
 * This should be rarely used outside of the main application config.
 * Exposed for exceptional cases such as in-memory views.
 */
exports.getPouch = (opts = {}) => {
  const COUCH_DB_URL = exports.getCouchUrl() || "http://localhost:4005"

  let POUCH_DB_DEFAULTS = {
    prefix: COUCH_DB_URL,
  }

  if (opts.inMemory) {
    const inMemory = require("pouchdb-adapter-memory")
    PouchDB.plugin(inMemory)
    POUCH_DB_DEFAULTS = {
      prefix: undefined,
      adapter: "memory",
    }
  }

  if (opts.replication) {
    const replicationStream = require("pouchdb-replication-stream")
    PouchDB.plugin(replicationStream.plugin)
    PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)
  }

  if (opts.find) {
    const find = require("pouchdb-find")
    PouchDB.plugin(find)
  }

  const Pouch = PouchDB.defaults(POUCH_DB_DEFAULTS)
  if (opts.allDbs) {
    const allDbs = require("pouchdb-all-dbs")
    allDbs(Pouch)
  }

  return Pouch
}

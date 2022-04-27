const PouchDB = require("pouchdb")
const env = require("../environment")

exports.getCouchInfo = () => {
  let url = "http://localhost:4005"
  if (env.COUCH_DB_URL && env.COUCH_DB_URL.includes("@")) {
    url = env.COUCH_DB_URL
  } else if (env.COUCH_DB_URL) {
    const [protocol, ...rest] = env.COUCH_DB_URL.split("://")
    url = `${protocol}://${env.COUCH_DB_USERNAME}:${env.COUCH_DB_PASSWORD}@${rest}`
    if (!env.COUCH_DB_USERNAME || !env.COUCH_DB_PASSWORD) {
      throw new Error(
        "CouchDB configuration invalid. You must provide a fully qualified CouchDB url, or the COUCH_DB_USER and COUCH_DB_PASSWORD environment variables."
      )
    }
  }
  const [protocol, rest] = url.split("://")
  const [auth, host] = rest.split("@")
  let [username, password] = auth.split(":")
  if (!username && env.COUCH_DB_USERNAME) {
    username = env.COUCH_DB_USERNAME
  }
  if (!password && env.COUCH_DB_PASSWORD) {
    password = env.COUCH_DB_PASSWORD
  }
  const authCookie = Buffer.from(`${username}:${password}`).toString("base64")
  return {
    url: `${protocol}://${host}`,
    auth: {
      username: username,
      password: password,
    },
    cookie: `Basic ${authCookie}`,
  }
}

/**
 * Return a constructor for PouchDB.
 * This should be rarely used outside of the main application config.
 * Exposed for exceptional cases such as in-memory views.
 */
exports.getPouch = (opts = {}) => {
  let { url, cookie } = exports.getCouchInfo()
  let POUCH_DB_DEFAULTS = {
    prefix: url,
    fetch: (url, opts) => {
      // use a specific authorization cookie - be very explicit about how we authenticate
      opts.headers.set("Authorization", cookie)
      return PouchDB.fetch(url, opts)
    },
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

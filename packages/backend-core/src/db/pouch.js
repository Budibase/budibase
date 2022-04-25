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

exports.splitCouchUrl = url => {
  const [protocol, rest] = url.split("://")
  const [auth, host] = rest.split("@")
  const [username, password] = auth.split(":")
  return {
    url: `${protocol}://${host}`,
    auth: {
      username,
      password,
    },
  }
}

/**
 * Return a constructor for PouchDB.
 * This should be rarely used outside of the main application config.
 * Exposed for exceptional cases such as in-memory views.
 */
exports.getPouch = (opts = {}) => {
  let auth = {
    username: env.COUCH_DB_USERNAME,
    password: env.COUCH_DB_PASSWORD,
  }
  let url = exports.getCouchUrl() || "http://localhost:4005"
  // need to update security settings
  if (!auth.username || !auth.password || url.includes("@")) {
    const split = exports.splitCouchUrl(url)
    url = split.url
    auth = split.auth
  }

  const authCookie = Buffer.from(`${auth.username}:${auth.password}`).toString(
    "base64"
  )
  let POUCH_DB_DEFAULTS = {
    prefix: url,
    fetch: (url, opts) => {
      // use a specific authorization cookie - be very explicit about how we authenticate
      opts.headers.set("Authorization", `Basic ${authCookie}`)
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

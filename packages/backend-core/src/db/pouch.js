const PouchDB = require("pouchdb")
const env = require("../environment")

function getUrlInfo() {
  let url = env.COUCH_DB_URL
  let username, password, host
  const [protocol, rest] = url.split("://")
  if (url.includes("@")) {
    const hostParts = rest.split("@")
    host = hostParts[1]
    const authParts = hostParts[0].split(":")
    username = authParts[0]
    password = authParts[1]
  } else {
    host = rest
  }
  return {
    url: `${protocol}://${host}`,
    auth: {
      username,
      password,
    },
  }
}

exports.getCouchInfo = () => {
  const urlInfo = getUrlInfo()
  let username
  let password
  if (env.COUCH_DB_USERNAME) {
    // set from env
    username = env.COUCH_DB_USERNAME
  } else if (urlInfo.auth.username) {
    // set from url
    username = urlInfo.auth.username
  } else if (!env.isTest()) {
    throw new Error("CouchDB username not set")
  }
  if (env.COUCH_DB_PASSWORD) {
    // set from env
    password = env.COUCH_DB_PASSWORD
  } else if (urlInfo.auth.password) {
    // set from url
    password = urlInfo.auth.password
  } else if (!env.isTest()) {
    throw new Error("CouchDB password not set")
  }
  const authCookie = Buffer.from(`${username}:${password}`).toString("base64")
  return {
    url: urlInfo.url,
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

  return PouchDB.defaults(POUCH_DB_DEFAULTS)
}

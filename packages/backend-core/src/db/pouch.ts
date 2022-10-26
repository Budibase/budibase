import PouchDB from "pouchdb"
import env from "../environment"

export const getUrlInfo = (url = env.COUCH_DB_URL) => {
  let cleanUrl, username, password, host
  if (url) {
    // Ensure the URL starts with a protocol
    const protoRegex = /^https?:\/\//i
    if (!protoRegex.test(url)) {
      url = `http://${url}`
    }

    // Split into protocol and remainder
    const split = url.split("://")
    const protocol = split[0]
    const rest = split.slice(1).join("://")

    // Extract auth if specified
    if (url.includes("@")) {
      // Split into host and remainder
      let parts = rest.split("@")
      host = parts[parts.length - 1]
      let auth = parts.slice(0, -1).join("@")

      // Split auth into username and password
      if (auth.includes(":")) {
        const authParts = auth.split(":")
        username = authParts[0]
        password = authParts.slice(1).join(":")
      } else {
        username = auth
      }
    } else {
      host = rest
    }
    cleanUrl = `${protocol}://${host}`
  }
  return {
    url: cleanUrl,
    auth: {
      username,
      password,
    },
  }
}

export const getCouchInfo = () => {
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
export const getPouch = (opts: any = {}) => {
  let { url, cookie } = getCouchInfo()
  let POUCH_DB_DEFAULTS = {
    prefix: url,
    fetch: (url: string, opts: any) => {
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
      // @ts-ignore
      adapter: "memory",
    }
  }

  if (opts.onDisk) {
    POUCH_DB_DEFAULTS = {
      prefix: undefined,
      // @ts-ignore
      adapter: "leveldb",
    }
  }

  if (opts.replication) {
    const replicationStream = require("pouchdb-replication-stream")
    PouchDB.plugin(replicationStream.plugin)
    // @ts-ignore
    PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)
  }

  if (opts.find) {
    const find = require("pouchdb-find")
    PouchDB.plugin(find)
  }

  return PouchDB.defaults(POUCH_DB_DEFAULTS)
}

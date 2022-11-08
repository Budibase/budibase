import PouchDB from "pouchdb"
import env from "../environment"
import { getCouchInfo } from "../couch"
export { getCouchInfo } from "../couch"

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
      // @ts-ignore
      adapter: "memory",
    }
  }

  if (opts.onDisk) {
    POUCH_DB_DEFAULTS = {
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

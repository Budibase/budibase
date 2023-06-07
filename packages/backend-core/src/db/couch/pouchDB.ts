import PouchDB from "pouchdb"
import env from "../../environment"
import { PouchOptions } from "@budibase/types"
import { getCouchInfo } from "./connections"

let Pouch: any
let initialised = false

/**
 * Return a constructor for PouchDB.
 * This should be rarely used outside of the main application config.
 * Exposed for exceptional cases such as in-memory views.
 */
export const getPouch = (opts: PouchOptions = {}) => {
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
    const replicationStream = require("@budibase/pouchdb-replication-stream")
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

export function init(opts?: PouchOptions) {
  Pouch = getPouch(opts)
  initialised = true
}

const checkInitialised = () => {
  if (!initialised) {
    throw new Error("init has not been called")
  }
}

export function getPouchDB(dbName: string, opts?: any): PouchDB.Database {
  checkInitialised()
  const db = new Pouch(dbName, opts)
  const dbPut = db.put
  db.put = async (doc: any, options = {}) => {
    if (!doc.createdAt) {
      doc.createdAt = new Date().toISOString()
    }
    doc.updatedAt = new Date().toISOString()
    return dbPut(doc, options)
  }
  db.exists = async () => {
    const info = await db.info()
    return !info.error
  }
  return db
}

// use this function if you have called getPouchDB - close
// the databases you've opened once finished
export async function closePouchDB(db: PouchDB.Database) {
  if (!db || env.isTest()) {
    return
  }
  try {
    // specifically await so that if there is an error, it can be ignored
    return await db.close()
  } catch (err) {
    // ignore error, already closed
  }
}

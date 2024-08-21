import PouchDB from "pouchdb"
import { checkSlashesInUrl } from "../utils"
import fetch from "node-fetch"

/**
 * Fully qualified URL including username and password, or nothing for local
 */
export function getPouch(url?: string) {
  let POUCH_DB_DEFAULTS
  if (!url) {
    POUCH_DB_DEFAULTS = {
      prefix: undefined,
      adapter: "leveldb",
    }
  } else {
    POUCH_DB_DEFAULTS = {
      prefix: url,
    }
  }
  const replicationStream = require("@budibase/pouchdb-replication-stream")
  PouchDB.plugin(replicationStream.plugin)
  // @ts-ignore
  PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)
  return PouchDB.defaults(POUCH_DB_DEFAULTS) as PouchDB.Static
}

export async function getAllDbs(url: string) {
  const response = await fetch(
    checkSlashesInUrl(encodeURI(`${url}/_all_dbs`)),
    {
      method: "GET",
    }
  )
  if (response.status === 200) {
    return await response.json()
  } else {
    throw "Cannot connect to CouchDB instance"
  }
}

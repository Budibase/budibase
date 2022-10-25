import * as pouch from "./pouch"
import env from "../environment"
import { checkSlashesInUrl } from "../helpers"
import fetch from "node-fetch"
import { PouchOptions, CouchFindOptions } from "@budibase/types"
import PouchDB from "pouchdb"

const openDbs: string[] = []
let Pouch: any
let initialised = false
const dbList = new Set()

if (env.MEMORY_LEAK_CHECK) {
  setInterval(() => {
    console.log("--- OPEN DBS ---")
    console.log(openDbs)
  }, 5000)
}

const put =
  (dbPut: any) =>
  async (doc: any, options = {}) => {
    if (!doc.createdAt) {
      doc.createdAt = new Date().toISOString()
    }
    doc.updatedAt = new Date().toISOString()
    return dbPut(doc, options)
  }

const checkInitialised = () => {
  if (!initialised) {
    throw new Error("init has not been called")
  }
}

export async function init(opts?: PouchOptions) {
  Pouch = pouch.getPouch(opts)
  initialised = true
}

// NOTE: THIS IS A DANGEROUS FUNCTION - USE WITH CAUTION
// this function is prone to leaks, should only be used
// in situations that using the function doWithDB does not work
export function dangerousGetDB(dbName: string, opts?: any): PouchDB.Database {
  checkInitialised()
  if (env.isTest()) {
    dbList.add(dbName)
  }
  const db = new Pouch(dbName, opts)
  if (env.MEMORY_LEAK_CHECK) {
    openDbs.push(db.name)
  }
  const dbPut = db.put
  db.put = put(dbPut)
  return db
}

// use this function if you have called dangerousGetDB - close
// the databases you've opened once finished
export async function closeDB(db: PouchDB.Database) {
  if (!db || env.isTest()) {
    return
  }
  if (env.MEMORY_LEAK_CHECK) {
    openDbs.splice(openDbs.indexOf(db.name), 1)
  }
  try {
    // specifically await so that if there is an error, it can be ignored
    return await db.close()
  } catch (err) {
    // ignore error, already closed
  }
}

// we have to use a callback for this so that we can close
// the DB when we're done, without this manual requests would
// need to close the database when done with it to avoid memory leaks
export async function doWithDB(dbName: string, cb: any, opts = {}) {
  const db = dangerousGetDB(dbName, opts)
  // need this to be async so that we can correctly close DB after all
  // async operations have been completed
  try {
    return await cb(db)
  } finally {
    await closeDB(db)
  }
}

export function allDbs() {
  if (!env.isTest()) {
    throw new Error("Cannot be used outside test environment.")
  }
  checkInitialised()
  return [...dbList]
}

export async function directCouchQuery(
  path: string,
  method: string = "GET",
  body?: any
) {
  let { url, cookie } = pouch.getCouchInfo()
  const couchUrl = `${url}/${path}`
  const params: any = {
    method: method,
    headers: {
      Authorization: cookie,
    },
  }
  if (body && method !== "GET") {
    params.body = JSON.stringify(body)
    params.headers["Content-Type"] = "application/json"
  }
  const response = await fetch(checkSlashesInUrl(encodeURI(couchUrl)), params)
  if (response.status < 300) {
    return await response.json()
  } else {
    throw "Cannot connect to CouchDB instance"
  }
}

export async function directCouchAllDbs(queryString?: string) {
  let couchPath = "/_all_dbs"
  if (queryString) {
    couchPath += `?${queryString}`
  }
  return await directCouchQuery(couchPath)
}

export async function directCouchFind(dbName: string, opts: CouchFindOptions) {
  const json = await directCouchQuery(`${dbName}/_find`, "POST", opts)
  return { rows: json.docs, bookmark: json.bookmark }
}

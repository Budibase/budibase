import env from "../environment"
import { directCouchQuery, PouchLike } from "./couch"
import { CouchFindOptions } from "@budibase/types"

let initialised = false
const dbList = new Set()

const checkInitialised = () => {
  if (!initialised) {
    throw new Error("init has not been called")
  }
}

export function getDB(dbName?: string, opts?: any): PouchLike {
  if (env.isTest()) {
    dbList.add(dbName)
  }
  return new PouchLike(dbName, opts)
}

// we have to use a callback for this so that we can close
// the DB when we're done, without this manual requests would
// need to close the database when done with it to avoid memory leaks
export async function doWithDB(dbName: string, cb: any, opts = {}) {
  const db = getDB(dbName, opts)
  // need this to be async so that we can correctly close DB after all
  // async operations have been completed
  return await cb(db)
}

export function allDbs() {
  if (!env.isTest()) {
    throw new Error("Cannot be used outside test environment.")
  }
  checkInitialised()
  return [...dbList]
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

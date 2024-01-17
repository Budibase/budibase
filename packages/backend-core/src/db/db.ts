import { directCouchQuery, DatabaseImpl } from "./couch"
import { CouchFindOptions, Database, DatabaseOpts } from "@budibase/types"
import { DDInstrumentedDatabase } from "./instrumentation"

export function getDB(dbName: string, opts?: DatabaseOpts): Database {
  return new DDInstrumentedDatabase(new DatabaseImpl(dbName, opts))
}

// we have to use a callback for this so that we can close
// the DB when we're done, without this manual requests would
// need to close the database when done with it to avoid memory leaks
export async function doWithDB<T>(
  dbName: string,
  cb: (db: Database) => Promise<T>,
  opts?: DatabaseOpts
) {
  const db = getDB(dbName, opts)
  // need this to be async so that we can correctly close DB after all
  // async operations have been completed
  return await cb(db)
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

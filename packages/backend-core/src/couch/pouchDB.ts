import PouchDB from "pouchdb"
import env from "../environment"
import { PouchOptions } from "@budibase/types"
import * as pouch from "../db/pouch"

let Pouch: any
let initialised = false

export async function init(opts?: PouchOptions) {
  Pouch = pouch.getPouch(opts)
  initialised = true
}

const checkInitialised = () => {
  if (!initialised) {
    throw new Error("init has not been called")
  }
}

export function getPouchDB(dbName: string, opts?: any): PouchDB.Database {
  checkInitialised()
  return new Pouch(dbName, opts)
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

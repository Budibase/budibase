const pouch = require("./pouch")

let PouchDB
let initialised = false

const put =
  dbPut =>
  async (doc, options = {}) => {
    const response = await dbPut(doc, options)
    // TODO: add created / updated
    return response
  }

const checkInitialised = () => {
  if (!initialised) {
    throw new Error("init has not been called")
  }
}

exports.init = opts => {
  PouchDB = pouch.getPouch(opts)
  initialised = true
}

// NOTE: THIS IS A DANGEROUS FUNCTION - USE WITH CAUTION
// this function is prone to leaks, should only be used
// in situations that using the function doWithDB does not work
exports.dangerousGetDB = (dbName, opts) => {
  checkInitialised()
  const db = new PouchDB(dbName, opts)
  const dbPut = db.put
  db.put = put(dbPut)
  return db
}

// we have to use a callback for this so that we can close
// the DB when we're done, without this manual requests would
// need to close the database when done with it to avoid memory leaks
exports.doWithDB = async (dbName, cb, opts) => {
  const db = exports.dangerousGetDB(dbName, opts)
  // need this to be async so that we can correctly close DB after all
  // async operations have been completed
  const resp = await cb(db)
  try {
    await db.close()
  } catch (err) {
    // ignore error - it may have not opened database/is closed already
  }
  return resp
}

exports.allDbs = () => {
  checkInitialised()
  return PouchDB.allDbs()
}

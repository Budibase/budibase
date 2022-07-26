const pouch = require("./pouch")
const env = require("../environment")

const openDbs = []
let PouchDB
let initialised = false
const dbList = new Set()

if (env.MEMORY_LEAK_CHECK) {
  setInterval(() => {
    console.log("--- OPEN DBS ---")
    console.log(openDbs)
  }, 5000)
}

const put =
  dbPut =>
  async (doc, options = {}) => {
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

exports.init = opts => {
  PouchDB = pouch.getPouch(opts)
  initialised = true
}

// NOTE: THIS IS A DANGEROUS FUNCTION - USE WITH CAUTION
// this function is prone to leaks, should only be used
// in situations that using the function doWithDB does not work
exports.dangerousGetDB = (dbName, opts) => {
  checkInitialised()
  if (env.isTest()) {
    dbList.add(dbName)
  }
  const db = new PouchDB(dbName, opts)
  if (env.MEMORY_LEAK_CHECK) {
    openDbs.push(db.name)
  }
  const dbPut = db.put
  db.put = put(dbPut)
  return db
}

// use this function if you have called dangerousGetDB - close
// the databases you've opened once finished
exports.closeDB = async db => {
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
exports.doWithDB = async (dbName, cb, opts = {}) => {
  const db = exports.dangerousGetDB(dbName, opts)
  // need this to be async so that we can correctly close DB after all
  // async operations have been completed
  try {
    return await cb(db)
  } finally {
    await exports.closeDB(db)
  }
}

exports.allDbs = () => {
  if (!env.isTest()) {
    throw new Error("Cannot be used outside test environment.")
  }
  checkInitialised()
  return [...dbList]
}

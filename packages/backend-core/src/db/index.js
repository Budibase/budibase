const pouch = require("./pouch")

let PouchDB
let initialised = false

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

exports.getDB = (dbName, opts) => {
  checkInitialised()
  const db = new PouchDB(dbName, opts)
  const dbPut = db.put
  db.put = put(dbPut)
  return db
}

exports.allDbs = () => {
  checkInitialised()
  return PouchDB.allDbs()
}

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

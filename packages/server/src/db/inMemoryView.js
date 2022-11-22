const newid = require("./newid")

// bypass the main application db config
// use in memory pouchdb directly
const { db: dbCore } = require("@budibase/backend-core")
const Pouch = dbCore.getPouch({ inMemory: true })

exports.runView = async (view, calculation, group, data) => {
  // use a different ID each time for the DB, make sure they
  // are always unique for each query, don't want overlap
  // which could cause 409s
  const db = new Pouch(newid())
  try {
    // write all the docs to the in memory Pouch (remove revs)
    await db.bulkDocs(
      data.map(row => ({
        ...row,
        _rev: undefined,
      }))
    )
    let fn = (doc, emit) => emit(doc._id)
    eval("fn = " + view.map.replace("function (doc)", "function (doc, emit)"))
    const queryFns = {
      meta: view.meta,
      map: fn,
    }
    if (view.reduce) {
      queryFns.reduce = view.reduce
    }
    const response = await db.query(queryFns, {
      include_docs: !calculation,
      group: !!group,
    })
    // need to fix the revs to be totally accurate
    for (let row of response.rows) {
      if (!row._rev || !row._id) {
        continue
      }
      const found = data.find(possible => possible._id === row._id)
      if (found) {
        row._rev = found._rev
      }
    }
    return response
  } finally {
    await db.destroy()
    await dbCore.closePouchDB(db)
  }
}

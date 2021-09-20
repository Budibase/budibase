const PouchDB = require("pouchdb")
const memory = require("pouchdb-adapter-memory")

PouchDB.plugin(memory)
const Pouch = PouchDB.defaults({
  prefix: undefined,
  adapter: "memory",
})

exports.runView = async (appId, view, calculation, group, data) => {
  // appId doesn't really do anything since its all in memory
  // use it just incase multiple databases at the same time
  const db = new Pouch(appId)
  await db.put({
    _id: "_design/database",
    views: {
      runner: view,
    },
  })
  // write all the docs to the in memory Pouch (remove revs)
  await db.bulkDocs(
    data.map(row => ({
      ...row,
      _rev: undefined,
    }))
  )
  const response = await db.query("database/runner", {
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
  await db.destroy()
  return response
}

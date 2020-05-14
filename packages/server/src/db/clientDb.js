const CouchDB = require("./client")

exports.create = async clientId => {
  const dbId = `client-${clientId}`
  const db = new CouchDB(dbId)
  await db.put({
    _id: "_design/client",
    views: {
      by_type: {
        map: `function(doc) {
            emit([doc.type], doc._id)
          }`,
      },
    },
  })
  return db
}

exports.destroy = async function(clientId) {
  const dbId = `client-${clientId}`
  await new CouchDB(dbId).destroy()
}

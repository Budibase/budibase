const CouchDb = require(".")

module.exports = async clientId => {
  await CouchDb.db.create(clientId)

  const db = CouchDb.db.use(clientId)

  await db.insert(
    {
      views: {
        by_type: {
          map: `function(doc) {
            emit([doc.type], doc._id)
          }`,
        },
      },
    },
    "_design/client"
  )

  return clientId
}

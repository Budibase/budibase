const CouchDb = require(".")

module.exports = async (config, clientId) => {
  await CouchDb.db.create(`client-${clientId}`)

  const db = CouchDb(config).db.use(`client-${clientId}`)

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

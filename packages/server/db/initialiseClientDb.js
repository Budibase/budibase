module.exports = async db => {
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
}

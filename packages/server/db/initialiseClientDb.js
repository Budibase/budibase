module.exports = async db => {
  const doc = await db.put({
    _id: "_design/client",
    views: {
      by_type: {
        map: `function(doc) {
            emit([doc.type], doc._id)
          }`,
      },
    },
  });
  console.log(doc);
}

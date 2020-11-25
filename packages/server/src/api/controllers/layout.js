const CouchDB = require("../../db/client")
const { generateLayoutID } = require("../../db/utils")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  let layout = ctx.request.body

  layout._id = layout._id || generateLayoutID()
  ctx.body = await db.put(layout)
  ctx.status = 200
}

const CouchDB = require("../../db/client")
const { generateLayoutID } = require("../../db/utils")
const compileStaticAssets = require("../../utilities/builder/compileStaticAssets")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  let layout = ctx.request.body

  layout._id = layout._id || generateLayoutID()
  layout = await compileStaticAssets(ctx.user.appId, layout)
  ctx.body = await db.put(layout)
  ctx.status = 200
}

const CouchDB = require("../../db/client")
const { generateLayoutID } = require("../../db/utils")
const compileStaticAssets = require("../../utilities/builder/compileStaticAssets")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const appPackage = ctx.request.body

  // remove special doc props which couch will complain about
  delete appPackage.layout._css
  appPackage.layout._id = appPackage.layout._id || generateLayoutID()
  ctx.body = await db.put(appPackage.layout)
  await compileStaticAssets(ctx.user.appId)
  ctx.status = 200
}

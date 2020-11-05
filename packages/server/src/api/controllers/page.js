const CouchDB = require("../../db/client")
const { generatePageID } = require("../../db/utils")
const { compileStaticAssetsForPage } = require("../../utilities/builder")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const appPackage = ctx.request.body

  await compileStaticAssetsForPage(
    ctx.user.appId,
    ctx.params.pageId,
    ctx.request.body
  )

  // remove special doc props which couch will complain about
  delete appPackage.page._css
  delete appPackage.page._screens
  appPackage.page._id = appPackage.page._id || generatePageID()
  ctx.body = await db.put(appPackage.page)
  ctx.status = 200
}

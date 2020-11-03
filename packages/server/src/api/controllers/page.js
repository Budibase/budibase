const CouchDB = require("../../db/client")
const { generatePageID } = require("../../db/utils")
const { buildPage } = require("../../utilities/builder")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const appPackage = ctx.request.body

  // TODO: rename to something more descriptive
  await buildPage(
    ctx.config,
    ctx.user.appId,
    ctx.params.pageId,
    ctx.request.body
  )

  // write the page data to couchDB
  // if (pkg.page._css) {
  //   delete pkg.page._css
  // }

  // if (pkg.page.name) {
  //   delete pkg.page.name
  // }

  // if (pkg.page._screens) {
  //   delete pkg.page._screens
  // }
  appPackage.page._id = appPackage.page._id || generatePageID()
  await db.put(appPackage.page)
  ctx.message = "Page saved successfully."
  ctx.status = 200
}

/**
 * This controller is not currently fully implemented. Screens are
 * currently managed as part of the pages API, please look in api/routes/page.js
 * for routes and controllers.
 */
const CouchDB = require("../../db")
const { getScreenParams, generateScreenID } = require("../../db/utils")

exports.fetch = async ctx => {
  const db = new CouchDB(ctx.user.appId)

  const screens = await db.allDocs(
    getScreenParams(null, {
      include_docs: true,
    })
  )

  ctx.body = screens.rows.map(element => element.doc)
}

exports.find = async ctx => {
  const db = new CouchDB(ctx.user.appId)

  const screens = await db.allDocs(
    getScreenParams(ctx.params.pageId, {
      include_docs: true,
    })
  )

  ctx.body = screens.response.rows
}

exports.save = async ctx => {
  const appId = ctx.user.appId
  const db = new CouchDB(appId)
  const screen = ctx.request.body

  if (!screen._id) {
    screen._id = generateScreenID(ctx.params.pageId)
  }
  delete screen._css
  const response = await db.put(screen)

  ctx.message = `Screen ${screen.name} saved.`
  ctx.body = response
}

exports.destroy = async ctx => {
  const db = new CouchDB(ctx.user.appId)
  await db.remove(ctx.params.screenId, ctx.params.revId)
  ctx.message = "Screen deleted successfully"
}

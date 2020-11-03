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
    getScreenParams(ctx.params.pageId, null, {
      include_docs: true,
    })
  )

  ctx.body = screens.response.rows
}

exports.create = async ctx => {
  const db = new CouchDB(ctx.user.appId)
  const screen = {
    // name: ctx.request.body.name,
    // _rev: ctx.request.body._rev,
    // permissions: ctx.request.body.permissions || [],
    // _id: generateAccessLevelID(),
    // type: "accesslevel",
  }

  const response = await db.put(screen)
  ctx.body = {
    ...screen,
    ...response,
  }
  ctx.message = `Screen '${screen.name}' created successfully.`
}

exports.save = async ctx => {
  const appId = ctx.user.appId
  const db = new CouchDB(appId)
  const screen = ctx.request.body

  if (!screen._id) {
    screen._id = generateScreenID()
  }

  const response = await db.put(screen)

  ctx.message = `Screen ${screen.name} saved.`
  ctx.body = response
}

exports.destroy = async ctx => {
  const db = new CouchDB(ctx.user.appId)
  await db.remove(ctx.params.screenId, ctx.params.revId)
  ctx.message = "Screen deleted successfully"
}

/**
 * This controller is not currently fully implemented. Screens are
 * currently managed as part of the pages API, please look in api/routes/page.js
 * for routes and controllers.
 */
const CouchDB = require("../../db")

exports.fetch = async ctx => {
  ctx.throw(501)
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
  ctx.throw(501)
}

exports.destroy = async ctx => {
  ctx.throw(501)
}

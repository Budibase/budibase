const { getScreenParams, generateScreenID } = require("../../db/utils")
const { AccessController } = require("@budibase/backend-core/roles")
const { getAppDB } = require("@budibase/backend-core/context")
const { events } = require("@budibase/backend-core")

exports.fetch = async ctx => {
  const db = getAppDB()

  const screens = (
    await db.allDocs(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(element => element.doc)

  ctx.body = await new AccessController().checkScreensAccess(
    screens,
    ctx.user.role._id
  )
}

exports.save = async ctx => {
  const db = getAppDB()
  let screen = ctx.request.body

  let eventFn
  if (!screen._id) {
    screen._id = generateScreenID()
    eventFn = events.screen.created
  }

  const response = await db.put(screen)

  if (eventFn) {
    await eventFn(screen)
  }
  ctx.message = `Screen ${screen.name} saved.`
  ctx.body = {
    ...screen,
    _id: response.id,
    _rev: response.rev,
  }
}

exports.destroy = async ctx => {
  const db = getAppDB()
  const id = ctx.params.screenId
  const screen = await db.get(id)

  await db.remove(id, ctx.params.screenRev)

  await events.screen.deleted(screen)
  ctx.body = {
    message: "Screen deleted successfully",
  }
  ctx.status = 200
}

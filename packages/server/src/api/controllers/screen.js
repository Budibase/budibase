const { getScreenParams, generateScreenID } = require("../../db/utils")
const { AccessController } = require("@budibase/backend-core/roles")
const { getAppDB } = require("@budibase/backend-core/context")

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

  if (!screen._id) {
    screen._id = generateScreenID()
  }
  const response = await db.put(screen)

  ctx.message = `Screen ${screen.name} saved.`
  ctx.body = {
    ...screen,
    _id: response.id,
    _rev: response.rev,
  }
}

exports.destroy = async ctx => {
  const db = getAppDB()
  await db.remove(ctx.params.screenId, ctx.params.screenRev)
  ctx.body = {
    message: "Screen deleted successfully",
  }
  ctx.status = 200
}

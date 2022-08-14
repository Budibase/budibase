const { EMPTY_LAYOUT } = require("../../constants/layouts")
const { generateLayoutID, getScreenParams } = require("../../db/utils")
const { getAppDB } = require("@budibase/backend-core/context")
const { events } = require("@budibase/backend-core")

exports.save = async function (ctx) {
  const db = getAppDB()
  let layout = ctx.request.body

  if (!layout.props) {
    layout = {
      ...EMPTY_LAYOUT,
      ...layout,
    }
    layout.props._instanceName = layout.name
  }

  layout._id = layout._id || generateLayoutID()
  const response = await db.put(layout)
  await events.layout.created(layout)
  layout._rev = response.rev

  ctx.body = layout
  ctx.status = 200
}

exports.destroy = async function (ctx) {
  const db = getAppDB()
  const layoutId = ctx.params.layoutId,
    layoutRev = ctx.params.layoutRev

  const layoutsUsedByScreens = (
    await db.allDocs(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(element => element.doc.layoutId)
  if (layoutsUsedByScreens.includes(layoutId)) {
    ctx.throw(400, "Cannot delete a layout that's being used by a screen")
  }

  await db.remove(layoutId, layoutRev)
  await events.layout.deleted(layoutId)
  ctx.body = { message: "Layout deleted successfully" }
  ctx.status = 200
}

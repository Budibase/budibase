const { EMPTY_LAYOUT } = require("../../constants/layouts")
const CouchDB = require("../../db")
const { generateLayoutID, getScreenParams } = require("../../db/utils")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  let layout = ctx.request.body

  if (!layout.props) {
    layout = {
      ...EMPTY_LAYOUT,
      ...layout,
    }
  }

  layout._id = layout._id || generateLayoutID()
  const response = await db.put(layout)
  layout._rev = response.rev

  ctx.body = layout
  ctx.status = 200
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
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
  ctx.message = "Layout deleted successfully"
  ctx.status = 200
}

const CouchDB = require("../../db")
const { generateLayoutID, getScreenParams } = require("../../db/utils")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  let layout = ctx.request.body

  layout._id = layout._id || generateLayoutID()
  ctx.body = await db.put(layout)
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
  ).rows.map(element => element.doc.props.layoutId)
  if (layoutsUsedByScreens.indexOf(layoutId) !== -1) {
    ctx.throw(400, "Cannot delete a base layout")
  }

  await db.remove(layoutId, layoutRev)
  ctx.message = "Layout deleted successfully"
  ctx.status = 200
}

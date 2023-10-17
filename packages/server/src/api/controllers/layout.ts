import { EMPTY_LAYOUT } from "../../constants/layouts"
import { generateLayoutID, getScreenParams } from "../../db/utils"
import { events, context } from "@budibase/backend-core"
import { BBContext } from "@budibase/types"

export async function save(ctx: BBContext) {
  const db = context.getAppDB()
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

export async function destroy(ctx: BBContext) {
  const db = context.getAppDB()
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

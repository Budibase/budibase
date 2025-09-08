import { context, events } from "@budibase/backend-core"
import {
  DeleteLayoutResponse,
  SaveLayoutRequest,
  SaveLayoutResponse,
  UserCtx,
} from "@budibase/types"
import { EMPTY_LAYOUT } from "../../constants/layouts"
import { generateLayoutID } from "../../db/utils"
import sdk from "../../sdk"

export async function save(
  ctx: UserCtx<SaveLayoutRequest, SaveLayoutResponse>
) {
  const db = context.getWorkspaceDB()
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
}

export async function destroy(ctx: UserCtx<void, DeleteLayoutResponse>) {
  const db = context.getWorkspaceDB()
  const layoutId = ctx.params.layoutId,
    layoutRev = ctx.params.layoutRev

  const layoutsUsedByScreens = (await sdk.screens.fetch()).map(
    screen => screen.layoutId
  )
  if (layoutsUsedByScreens.includes(layoutId)) {
    ctx.throw(400, "Cannot delete a layout that's being used by a screen")
  }

  await db.remove(layoutId, layoutRev)
  await events.layout.deleted(layoutId)
  ctx.body = { message: "Layout deleted successfully" }
}

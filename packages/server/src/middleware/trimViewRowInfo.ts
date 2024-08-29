import { Ctx, Row } from "@budibase/types"

import sdk from "../sdk"
import { Next } from "koa"
import { getSourceId } from "../api/controllers/row/utils"

export default async (ctx: Ctx<Row>, next: Next) => {
  const { body } = ctx.request
  const viewId = getSourceId(ctx).viewId ?? body._viewId

  // nothing to do, it is not a view (just a table ID)
  if (!viewId) {
    return next()
  }

  // don't need to trim delete requests
  if (ctx?.method?.toLowerCase() !== "delete") {
    await trimViewFields(ctx.request.body, viewId)
  }

  return next()
}

// have to mutate the koa context, can't return
export async function trimViewFields(body: Row, viewId: string): Promise<void> {
  const view = await sdk.views.get(viewId)
  const allowedKeys = sdk.views.allowedFields(view)
  // have to mutate the context, can't update reference
  const toBeRemoved = Object.keys(body).filter(
    key => !allowedKeys.includes(key)
  )
  for (let removeKey of toBeRemoved) {
    delete body[removeKey]
  }
}

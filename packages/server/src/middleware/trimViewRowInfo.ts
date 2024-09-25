import { Ctx, Row, ViewV2 } from "@budibase/types"

import sdk from "../sdk"
import { Next } from "koa"
import { getSourceId } from "../api/controllers/row/utils"

export default async (ctx: Ctx<Row, Row>, next: Next) => {
  const { body } = ctx.request
  const viewId = getSourceId(ctx).viewId ?? body._viewId

  // nothing to do, it is not a view (just a table ID)
  if (!viewId) {
    return next()
  }

  // don't need to trim delete requests
  const trimFields = ctx?.method?.toLowerCase() !== "delete"
  if (!trimFields) {
    return next()
  }

  const view = await sdk.views.get(viewId)
  ctx.request.body = await trimNonViewFields(ctx.request.body, view, "WRITE")

  await next()

  ctx.body = await trimNonViewFields(ctx.body, view, "READ")
}

// have to mutate the koa context, can't return
async function trimNonViewFields(
  row: Row,
  view: ViewV2,
  permission: "WRITE" | "READ"
): Promise<Row> {
  row = { ...row }
  const allowedKeys = sdk.views.allowedFields(view, permission)
  // have to mutate the context, can't update reference
  const toBeRemoved = Object.keys(row).filter(key => !allowedKeys.includes(key))
  for (let removeKey of toBeRemoved) {
    delete row[removeKey]
  }
  return row
}

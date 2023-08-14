import { Ctx, Row } from "@budibase/types"
import * as utils from "../db/utils"
import sdk from "../sdk"
import { db } from "@budibase/backend-core"
import { Next } from "koa"
import { getTableId } from "../api/controllers/row/utils"

export default async (ctx: Ctx<Row>, next: Next) => {
  const { body } = ctx.request
  let { _viewId: viewId } = body

  const possibleViewId = getTableId(ctx)
  if (utils.isViewID(possibleViewId)) {
    viewId = possibleViewId
  }

  // nothing to do, it is not a view (just a table ID)
  if (!viewId) {
    return next()
  }

  const { tableId } = utils.extractViewInfoFromID(viewId)

  // don't need to trim delete requests
  if (ctx?.method?.toLowerCase() !== "delete") {
    await trimViewFields(ctx.request.body, viewId, tableId)
  }

  ctx.params.sourceId = tableId

  return next()
}

// have to mutate the koa context, can't return
export async function trimViewFields<T extends Row>(
  body: Row,
  viewId: string,
  tableId: string
): Promise<void> {
  const view = await sdk.views.get(viewId)
  if (!view?.schema || !Object.keys(view.schema).length) {
    return
  }

  const table = await sdk.tables.getTable(tableId)
  const { schema } = sdk.views.enrichSchema(view!, table.schema)
  const allowedKeys = [
    ...Object.keys(schema),
    ...db.CONSTANT_EXTERNAL_ROW_COLS,
    ...db.CONSTANT_INTERNAL_ROW_COLS,
  ]
  // have to mutate the context, can't update reference
  const toBeRemoved = Object.keys(body).filter(
    key => !allowedKeys.includes(key)
  )
  for (let removeKey of toBeRemoved) {
    delete body[removeKey]
  }
}

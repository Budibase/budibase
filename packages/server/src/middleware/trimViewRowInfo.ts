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
    const { _viewId, ...trimmedView } = await trimViewFields(
      viewId,
      tableId,
      body
    )
    ctx.request.body = trimmedView
  }

  ctx.params.sourceId = tableId

  return next()
}

export async function trimViewFields<T extends Row>(
  viewId: string,
  tableId: string,
  data: T
): Promise<T> {
  const view = await sdk.views.get(viewId)
  if (!view?.schema || !Object.keys(view.schema).length) {
    return data
  }

  const table = await sdk.tables.getTable(tableId)
  const { schema } = sdk.views.enrichSchema(view!, table.schema)
  const result: Record<string, any> = {}
  for (const key of [
    ...Object.keys(schema),
    ...db.CONSTANT_EXTERNAL_ROW_COLS,
    ...db.CONSTANT_INTERNAL_ROW_COLS,
  ]) {
    result[key] = data[key] !== null ? data[key] : undefined
  }

  return result as T
}

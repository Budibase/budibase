import { RowActionTriggerRequest, Ctx } from "@budibase/types"
import sdk from "../../../sdk"

export async function run(ctx: Ctx<RowActionTriggerRequest, void>) {
  const { tableId } = ctx.params
  const table = await sdk.tables.getTable(tableId)
  if (!table) {
    ctx.throw(404)
  }

  const { rowId } = ctx.request.body
  console.warn({ rowId })
  ctx.status = 200
}

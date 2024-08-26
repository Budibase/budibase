import { RowActionTriggerRequest, Ctx } from "@budibase/types"
import sdk from "../../../sdk"

export async function run(ctx: Ctx<RowActionTriggerRequest, void>) {
  const { sourceId, actionId } = ctx.params
  const { rowId } = ctx.request.body

  await sdk.rowActions.run(sourceId, actionId, rowId)
  ctx.status = 200
}

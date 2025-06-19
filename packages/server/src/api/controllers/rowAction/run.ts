import {
  RowActionTriggerRequest,
  Ctx,
  RowActionTriggerResponse,
  isDidNotTriggerResponse,
} from "@budibase/types"
import * as triggers from "../../../automations/triggers"
import sdk from "../../../sdk"
import { context } from "@budibase/backend-core"

export async function run(
  ctx: Ctx<RowActionTriggerRequest, RowActionTriggerResponse>
) {
  const { tableId, actionId } = ctx.params
  const { rowId } = ctx.request.body

  const rowAction = await sdk.rowActions.get(tableId, actionId)
  if (!rowAction) {
    ctx.throw(
      404,
      `Failed to run row action with ID ${actionId} - row action not found.`
    )
  }

  const table = await sdk.tables.getTable(tableId)
  if (!table) {
    ctx.throw(
      404,
      `Failed to run row action with ID ${actionId} - table with ID ${tableId} not found.`
    )
  }

  const automation = await sdk.automations.get(rowAction.automationId)
  if (!automation) {
    ctx.throw(
      404,
      `Failed to run row action with ID ${actionId} - automation with ID ${rowAction.automationId} not found.`
    )
  }

  const row = await sdk.rows.find(tableId, rowId)

  const triggerResponse = await triggers.externalTrigger(
    automation,
    {
      fields: {
        id: row._id,
        revision: row._rev,
        row,
        table,
      },
      user: ctx.user,
      appId: context.getAppId(),
    },
    { getResponses: true }
  )

  if (isDidNotTriggerResponse(triggerResponse)) {
    ctx.body = { message: "Row action did not trigger." }
  } else {
    ctx.body = { message: "Row action triggered." }
  }
}

import { Next } from "koa"
import { Ctx } from "@budibase/types"
import { paramSubResource } from "./resourceId"
import { docIds } from "@budibase/backend-core"
import * as utils from "../db/utils"
import sdk from "../sdk"

export function triggerRowActionAuthorised(
  sourcePath: string,
  actionPath: string
) {
  return async (ctx: Ctx, next: Next) => {
    // Reusing the existing middleware to extract the value
    paramSubResource(sourcePath, actionPath)(ctx, () => {})
    const { resourceId: sourceId, subResourceId: rowActionId } = ctx

    const isTableId = docIds.isTableId(sourceId)
    const isViewId = utils.isViewID(sourceId)
    if (!isTableId && !isViewId) {
      ctx.throw(400, `'${sourceId}' is not a valid source id`)
    }

    const tableId = isTableId
      ? sourceId
      : utils.extractViewInfoFromID(sourceId).tableId

    const rowAction = await sdk.rowActions.get(tableId, rowActionId)

    if (isTableId && !rowAction.permissions.table.runAllowed) {
      ctx.throw(
        403,
        `Row action '${rowActionId}' is not enabled for table '${sourceId}'`
      )
    } else if (isViewId && !rowAction.permissions.views[sourceId]?.runAllowed) {
      ctx.throw(
        403,
        `Row action '${rowActionId}' is not enabled for view '${sourceId}'`
      )
    }

    // Enrich tableId
    ctx.params.tableId = tableId
    return next()
  }
}

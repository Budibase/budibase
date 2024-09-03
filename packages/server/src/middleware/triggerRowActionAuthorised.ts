import { Next } from "koa"
import { UserCtx } from "@budibase/types"
import { paramSubResource } from "./resourceId"
import { docIds } from "@budibase/backend-core"
import * as utils from "../db/utils"
import sdk from "../sdk"

export function triggerRowActionAuthorised(
  sourcePath: string,
  actionPath: string
) {
  function extractResourceIds(ctx: UserCtx) {
    ctx = { ...ctx }
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
    const viewId = isTableId ? undefined : sourceId
    return { tableId, viewId, rowActionId }
  }

  return async (ctx: UserCtx, next: Next) => {
    const { tableId, viewId, rowActionId } = extractResourceIds(ctx)

    const rowAction = await sdk.rowActions.get(tableId, rowActionId)

    if (!viewId && !rowAction.permissions.table.runAllowed) {
      ctx.throw(
        403,
        `Row action '${rowActionId}' is not enabled for table '${tableId}'`
      )
    } else if (viewId && !rowAction.permissions.views[viewId]?.runAllowed) {
      ctx.throw(
        403,
        `Row action '${rowActionId}' is not enabled for view '${viewId}'`
      )
    }

    // Enrich tableId
    ctx.params.tableId = tableId
    return next()
  }
}

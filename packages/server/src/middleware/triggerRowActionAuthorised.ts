import { Next } from "koa"
import { PermissionLevel, PermissionType, UserCtx } from "@budibase/types"
import { docIds } from "@budibase/backend-core"
import * as utils from "../db/utils"
import sdk from "../sdk"
import { authorizedResource } from "./authorized"

export function triggerRowActionAuthorised(
  sourcePath: string,
  actionPath: string
) {
  return async (ctx: UserCtx, next: Next) => {
    async function getResourceIds() {
      const sourceId: string = ctx.params[sourcePath]
      const rowActionId: string = ctx.params[actionPath]

      const isTableId = docIds.isTableId(sourceId)
      const isViewId = docIds.isViewId(sourceId)
      if (!isTableId && !isViewId) {
        ctx.throw(400, `'${sourceId}' is not a valid source id`)
      }

      const tableId = isTableId
        ? sourceId
        : utils.extractViewInfoFromID(sourceId).tableId
      const viewId = isTableId ? undefined : sourceId
      return { tableId, viewId, rowActionId }
    }

    const { tableId, viewId, rowActionId } = await getResourceIds()

    // Check if the user has permissions to the table/view
    await authorizedResource(
      !viewId ? PermissionType.TABLE : PermissionType.VIEW,
      PermissionLevel.READ,
      sourcePath
    )(ctx, () => {})

    // Check is the row action can run for the given view/table
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

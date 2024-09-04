import { Next } from "koa"
import { PermissionLevel, PermissionType, UserCtx } from "@budibase/types"
import { paramSubResource } from "./resourceId"
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
      // Reusing the existing middleware to extract the value
      await paramSubResource(sourcePath, actionPath)(ctx, () => {})

      const sourceId: string = ctx.resourceId
      const rowActionId: string = ctx.subResourceId

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

    async function guardResourcePermissions(
      ctx: UserCtx,
      tableId: string,
      viewId?: string
    ) {
      const { params } = ctx
      try {
        if (!viewId) {
          ctx.params = { tableId }
          await authorizedResource(
            PermissionType.TABLE,
            PermissionLevel.READ,
            "tableId"
          )(ctx, () => {})
        } else {
          ctx.params = { viewId }
          await authorizedResource(
            PermissionType.VIEW,
            PermissionLevel.READ,
            "__viewId"
          )(ctx, () => {})
        }
      } finally {
        ctx.params = params
      }
    }

    const { tableId, viewId, rowActionId } = await getResourceIds()

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

    await guardResourcePermissions(ctx, tableId, viewId)

    // Enrich tableId
    ctx.params.tableId = tableId
    return next()
  }
}

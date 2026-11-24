import { context, users } from "@budibase/backend-core"
import { isViewId } from "@budibase/shared-core"
import { UserCtx } from "@budibase/types"
import { Next } from "koa"
import sdk from "../sdk"
import { getSourceId } from "../api/controllers/row/utils"

export const viewRowScopeMiddleware = async (ctx: UserCtx, next: Next) => {
  const sourceId = ctx.params.sourceId
  if (
    !sourceId ||
    !isViewId(sourceId) ||
    (ctx.user && users.isBuilder(ctx.user, context.getWorkspaceId()))
  ) {
    return next()
  }

  const { tableId, viewId } = getSourceId(ctx)
  if (!viewId) {
    return next()
  }
  const body = ctx.request.body || {}
  const ids: string[] = []

  if (ctx.method === "PATCH" || ctx.method === "POST") {
    if (body._id) {
      ids.push(body._id)
    }
  }
  if (ctx.method === "DELETE") {
    if (Array.isArray(body.rows)) {
      ids.push(
        ...body.rows.map((row: string | { _id: string }) =>
          typeof row === "string" ? row : row._id
        )
      )
    } else if (body._id) {
      ids.push(body._id)
    }
  }
  if (/\/exportRows\/?$/.test(ctx.path)) {
    if (
      !Array.isArray(body.rows) ||
      body.rows.length === 0 ||
      !body.rows.every((row: string) => typeof row === "string")
    ) {
      ctx.throw(400, "rows are required when exporting through a view")
    }
    ids.push(...body.rows)

    const view = await sdk.views.get(viewId)
    const visibleFields = Object.entries(view.schema || {})
      .filter(([, field]) => field.visible)
      .map(([name]) => name)
    if (visibleFields.length === 0) {
      ctx.throw(400, "Cannot export a view with no visible columns")
    }
    if (body.columns != null && !Array.isArray(body.columns)) {
      ctx.throw(400, "columns must be a list")
    }
    if (
      body.columns?.some((column: string) => !visibleFields.includes(column))
    ) {
      ctx.throw(400, "Cannot export a hidden view column")
    }
    body.columns = body.columns?.length ? body.columns : visibleFields
  }

  const uniqueIds = [...new Set(ids.filter(Boolean))]
  if (uniqueIds.length > 0) {
    const { rows } = await sdk.rows.search(
      {
        tableId,
        viewId,
        query: {
          $or: {
            conditions: uniqueIds.map(id => ({ equal: { _id: id } })),
          },
        },
        limit: uniqueIds.length,
      },
      { user: sdk.users.getUserContextBindings(ctx.user) }
    )
    const found = new Set(rows.map(row => row._id))
    if (!uniqueIds.every(id => found.has(id))) {
      ctx.throw(404, "Row not found")
    }
  }

  await next()
}

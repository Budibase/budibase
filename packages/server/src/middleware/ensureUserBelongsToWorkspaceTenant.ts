import { context, tenancy } from "@budibase/backend-core"
import type { UserCtx } from "@budibase/types"
import type { Next } from "koa"
import env from "../environment"

export const ensureUserBelongsToWorkspaceTenant = async (
  ctx: UserCtx,
  next: Next
) => {
  const workspaceId = context.getWorkspaceId()
  if (
    env.MULTI_TENANCY &&
    workspaceId &&
    ctx.user?.tenantId &&
    !tenancy.isUserInWorkspaceTenant(workspaceId, ctx.user)
  ) {
    ctx.throw(401, "Session not authenticated")
  }

  return next()
}

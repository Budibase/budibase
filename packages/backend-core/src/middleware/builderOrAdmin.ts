import { UserCtx } from "@budibase/types"
import env from "../environment"
import { hasBuilderPermissions, isAdmin, isBuilder } from "../users"
import { getWorkspaceIdFromCtx } from "../utils"

export async function builderOrAdmin(ctx: UserCtx, next: any) {
  if (ctx.internal || isAdmin(ctx.user)) {
    return next()
  }

  const workspaceId = await getWorkspaceIdFromCtx(ctx)

  if (!workspaceId && !env.isWorker()) {
    ctx.throw(403, "This request required a workspace id.")
  } else if (!workspaceId && !hasBuilderPermissions(ctx.user)) {
    ctx.throw(403, "Admin/Builder user only endpoint.")
  } else if (workspaceId && !isBuilder(ctx.user, workspaceId)) {
    ctx.throw(403, "Workspace Admin/Builder user only endpoint.")
  }

  return next()
}

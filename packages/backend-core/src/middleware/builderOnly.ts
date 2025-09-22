import { UserCtx } from "@budibase/types"
import env from "../environment"
import { hasBuilderPermissions, isBuilder } from "../users"
import { getAppIdFromCtx } from "../utils"

export async function builderOnly(ctx: UserCtx, next: any) {
  if (ctx.internal) {
    return next()
  }

  const workspaceId = await getAppIdFromCtx(ctx)

  if (!workspaceId && !env.isWorker()) {
    ctx.throw(403, "This request required a workspace id.")
  } else if (!workspaceId && !hasBuilderPermissions(ctx.user)) {
    ctx.throw(403, "Builder user only endpoint.")
  } else if (workspaceId && !isBuilder(ctx.user, workspaceId)) {
    ctx.throw(403, "Workspace builder user only endpoint.")
  }

  return next()
}

import { UserCtx } from "@budibase/types"
import { hasBuilderPermissions, isBuilder } from "../users"
import { getAppIdFromCtx } from "../utils"

export async function builderOnly(ctx: UserCtx, next: any) {
  if (ctx.internal) {
    return next()
  }

  const workspaceId = await getAppIdFromCtx(ctx)
  if (!workspaceId && !hasBuilderPermissions(ctx.user)) {
    ctx.throw(403, "Builder user only endpoint.")
  } else if (!isBuilder(ctx.user, workspaceId)) {
    ctx.throw(403, "Builder user only endpoint.")
  }

  return next()
}

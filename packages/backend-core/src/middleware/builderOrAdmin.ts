import { UserCtx } from "@budibase/types"
import { hasBuilderPermissions, isAdmin, isBuilder } from "../users"
import { getAppIdFromCtx } from "../utils"

export async function builderOrAdmin(ctx: UserCtx, next: any) {
  const workspaceId = await getAppIdFromCtx(ctx)

  if (ctx.internal || isAdmin(ctx.user)) {
    return next()
  }

  if (!workspaceId && !hasBuilderPermissions(ctx.user)) {
    ctx.throw(403, "Admin/Builder user only endpoint.")
  } else if (!isBuilder(ctx.user, workspaceId)) {
    ctx.throw(403, "Admin/Builder user only endpoint.")
  }

  return next()
}

import { UserCtx } from "@budibase/types"
import { getWorkspaceId } from "../context"
import env from "../environment"
import { hasBuilderPermissions, isBuilder } from "../users"

type BuilderFn = (user: UserCtx["user"], appId?: string) => boolean
export async function builderOnly(ctx: UserCtx, next: any) {
  const appId = getWorkspaceId()

  let builderFn: BuilderFn | undefined
  if (env.isWorker() || !appId) {
    builderFn = hasBuilderPermissions
  } else if (env.isApps()) {
    builderFn = isBuilder
  }

  if (!builderFn) {
    throw new Error("Service name unknown - middleware inactive.")
  }

  if (!ctx.internal && !builderFn(ctx.user, appId)) {
    ctx.throw(403, "Builder user only endpoint.")
  }
  return next()
}

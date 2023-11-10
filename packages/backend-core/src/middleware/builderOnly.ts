import { UserCtx } from "@budibase/types"
import { isBuilder, hasBuilderPermissions } from "../users"
import { getAppId } from "../context"
import env from "../environment"

export default async (ctx: UserCtx, next: any) => {
  const appId = getAppId()
  const builderFn =
    env.isWorker() || !appId
      ? hasBuilderPermissions
      : env.isApps()
      ? isBuilder
      : undefined
  if (!builderFn) {
    throw new Error("Service name unknown - middleware inactive.")
  }
  if (!ctx.internal && !builderFn(ctx.user, appId)) {
    ctx.throw(403, "Builder user only endpoint.")
  }
  return next()
}

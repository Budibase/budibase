import { UserCtx } from "@budibase/types"
import { isBuilder } from "../users"
import { getAppId } from "../context"

export default async (ctx: UserCtx, next: any) => {
  const appId = getAppId()
  if (!ctx.internal && !isBuilder(ctx.user, appId)) {
    ctx.throw(403, "Builder user only endpoint.")
  }
  return next()
}

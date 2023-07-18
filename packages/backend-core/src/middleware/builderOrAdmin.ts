import { UserCtx } from "@budibase/types"
import { isBuilder, isAdmin } from "../users"
import { getAppId } from "../context"

export default async (ctx: UserCtx, next: any) => {
  const appId = getAppId()
  if (!ctx.internal && !isBuilder(ctx.user, appId) && !isAdmin(ctx.user)) {
    ctx.throw(403, "Admin/Builder user only endpoint.")
  }
  return next()
}

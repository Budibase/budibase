import { UserCtx } from "@budibase/types"
import { isAdmin } from "../users"

export default async (ctx: UserCtx, next: any) => {
  if (!ctx.internal && !isAdmin(ctx.user)) {
    ctx.throw(403, "Admin user only endpoint.")
  }
  return next()
}

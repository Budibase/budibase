import { BBContext } from "@budibase/types"

export default async (ctx: BBContext, next: any) => {
  if (
    !ctx.internal &&
    (!ctx.user || !ctx.user.admin || !ctx.user.admin.global)
  ) {
    ctx.throw(403, "Admin user only endpoint.")
  }
  return next()
}

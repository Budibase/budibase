import { User, UserCtx } from "@budibase/types"
import { isExpandedPublicApiEnabled } from "../features"

function removeRoles(ctx: UserCtx, oldUser?: User) {
  const user = ctx.request.body
  if (user.builder) {
    user.builder = oldUser?.builder || undefined
  }
  if (user.admin) {
    user.admin = oldUser?.admin || undefined
  }
  if (user.roles) {
    user.roles = oldUser?.roles || {}
  }
  ctx.request.body = user
  return ctx
}

// weird flow, but can't move the entirety of the public API into pro, so need to expose parts here
export async function roleCheck(ctx: UserCtx, oldUser?: User) {
  if (!(await isExpandedPublicApiEnabled())) {
    removeRoles(ctx, oldUser)
  }
  return ctx
}

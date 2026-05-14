import { users } from "@budibase/backend-core"
import type { UserCtx } from "@budibase/types"

interface GlobalRoleUpdate {
  builder?: boolean
  admin?: boolean
}

export const validateGlobalRoleUpdate = (
  ctx: UserCtx,
  roleUpdate: GlobalRoleUpdate
) => {
  if (roleUpdate.admin && !users.isAdmin(ctx.user)) {
    ctx.throw(403, "Only global admins can update global admin permissions.")
  }

  if (roleUpdate.builder && !users.isGlobalBuilder(ctx.user)) {
    ctx.throw(
      403,
      "Only global builders or admins can update global builder permissions."
    )
  }
}

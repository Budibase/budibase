import { users } from "@budibase/backend-core"
import type { User, UserCtx } from "@budibase/types"

interface GlobalRoleUpdate {
  builder?: boolean
  admin?: boolean
  appBuilder?: {
    appId?: string
  }
  role?: {
    appId?: string
  }
}

const validateAppRoleUpdate = (ctx: UserCtx, appId?: string) => {
  if (!appId) {
    return
  }

  if (!users.isAdmin(ctx.user) && !users.isBuilder(ctx.user, appId)) {
    ctx.throw(403, "Only app builders or admins can update app permissions.")
  }
}

export const validateBuilderAppUpdate = ({
  ctx,
  currentBuilder,
}: {
  ctx: UserCtx
  currentBuilder?: User["builder"]
}) => {
  const existingApps = currentBuilder?.apps || []
  for (const appId of ctx.request.body.builder?.apps || []) {
    if (!existingApps.includes(appId)) {
      validateAppRoleUpdate(ctx, appId)
    }
  }
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

  validateAppRoleUpdate(ctx, roleUpdate.appBuilder?.appId)
  validateAppRoleUpdate(ctx, roleUpdate.role?.appId)
}

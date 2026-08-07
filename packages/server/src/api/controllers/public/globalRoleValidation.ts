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
  requestedApps,
  currentBuilder,
}: {
  ctx: UserCtx
  requestedApps?: string[]
  currentBuilder?: User["builder"]
}) => {
  const existingApps = currentBuilder?.apps || []
  for (const appId of requestedApps || []) {
    if (!existingApps.includes(appId)) {
      validateAppRoleUpdate(ctx, appId)
    }
  }
}

export const validateRolesUpdate = ({
  ctx,
  requestedRoles,
  currentRoles,
}: {
  ctx: UserCtx
  requestedRoles?: User["roles"]
  currentRoles?: User["roles"]
}) => {
  const existingRoles = currentRoles || {}
  const nextRoles = requestedRoles || {}

  for (const [workspaceId, roleId] of Object.entries(nextRoles)) {
    if (existingRoles[workspaceId] === roleId) {
      continue
    }
    validateAppRoleUpdate(ctx, workspaceId)
  }

  for (const workspaceId of Object.keys(existingRoles)) {
    if (!(workspaceId in nextRoles)) {
      validateAppRoleUpdate(ctx, workspaceId)
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

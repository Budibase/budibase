import env from "../environment"
import * as events from "../events"
import * as accounts from "../accounts"
import { getTenantId } from "../context"
import { User, UserRoles, CloudAccount } from "@budibase/types"
import { hasBuilderPermissions, hasAdminPermissions } from "./utils"

export const handleDeleteEvents = async (user: any) => {
  await events.user.deleted(user)

  if (hasBuilderPermissions(user)) {
    await events.user.permissionBuilderRemoved(user)
  }

  if (hasAdminPermissions(user)) {
    await events.user.permissionAdminRemoved(user)
  }
}

const assignAppRoleEvents = async (
  user: User,
  roles: UserRoles,
  existingRoles: UserRoles
) => {
  for (const [appId, role] of Object.entries(roles)) {
    // app role in existing is not same as new
    if (!existingRoles || existingRoles[appId] !== role) {
      await events.role.assigned(user, role)
    }
  }
}

const unassignAppRoleEvents = async (
  user: User,
  roles: UserRoles,
  existingRoles: UserRoles
) => {
  if (!existingRoles) {
    return
  }
  for (const [appId, role] of Object.entries(existingRoles)) {
    // app role in new is not same as existing
    if (!roles || roles[appId] !== role) {
      await events.role.unassigned(user, role)
    }
  }
}

const handleAppRoleEvents = async (user: any, existingUser: any) => {
  const roles = user.roles
  const existingRoles = existingUser?.roles

  await assignAppRoleEvents(user, roles, existingRoles)
  await unassignAppRoleEvents(user, roles, existingRoles)
}

export const handleSaveEvents = async (
  user: User,
  existingUser: User | undefined
) => {
  const tenantId = getTenantId()
  let tenantAccount: CloudAccount | undefined
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    tenantAccount = await accounts.getAccountByTenantId(tenantId)
  }
  await events.identification.identifyUser(user, tenantAccount)

  if (existingUser) {
    await events.user.updated(user)

    if (isRemovingBuilder(user, existingUser)) {
      await events.user.permissionBuilderRemoved(user)
    }

    if (isRemovingAdmin(user, existingUser)) {
      await events.user.permissionAdminRemoved(user)
    }

    if (isOnboardingComplete(user, existingUser)) {
      await events.user.onboardingComplete(user)
    }

    if (
      !existingUser.forceResetPassword &&
      user.forceResetPassword &&
      user.password
    ) {
      await events.user.passwordForceReset(user)
    }

    if (user.password !== existingUser.password) {
      await events.user.passwordUpdated(user)
    }
  } else {
    await events.user.created(user)
  }

  if (isAddingBuilder(user, existingUser)) {
    await events.user.permissionBuilderAssigned(user)
  }

  if (isAddingAdmin(user, existingUser)) {
    await events.user.permissionAdminAssigned(user)
  }

  await handleAppRoleEvents(user, existingUser)
}

export const isAddingBuilder = (user: any, existingUser: any) => {
  return isAddingPermission(user, existingUser, hasBuilderPermissions)
}

export const isRemovingBuilder = (user: any, existingUser: any) => {
  return isRemovingPermission(user, existingUser, hasBuilderPermissions)
}

const isAddingAdmin = (user: any, existingUser: any) => {
  return isAddingPermission(user, existingUser, hasAdminPermissions)
}

const isRemovingAdmin = (user: any, existingUser: any) => {
  return isRemovingPermission(user, existingUser, hasAdminPermissions)
}

const isOnboardingComplete = (user: any, existingUser: any) => {
  return !existingUser?.onboardedAt && typeof user.onboardedAt === "string"
}

/**
 * Check if a permission is being added to a new or existing user.
 */
const isAddingPermission = (
  user: any,
  existingUser: any,
  hasPermission: any
) => {
  // new user doesn't have the permission
  if (!hasPermission(user)) {
    return false
  }

  // existing user has the permission
  if (existingUser && hasPermission(existingUser)) {
    return false
  }

  // permission is being added
  return true
}

/**
 * Check if a permission is being removed from an existing user.
 */
const isRemovingPermission = (
  user: any,
  existingUser: any,
  hasPermission: any
) => {
  // new user has the permission
  if (hasPermission(user)) {
    return false
  }

  // no existing user or existing user doesn't have the permission
  if (!existingUser) {
    return false
  }

  // existing user doesn't have the permission
  if (!hasPermission(existingUser)) {
    return false
  }

  // permission is being removed
  return true
}

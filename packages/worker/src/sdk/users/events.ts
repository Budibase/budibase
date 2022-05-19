import { events } from "@budibase/backend-core"
import { User, UserRoles } from "@budibase/types"

export const handleDeleteEvents = (user: any) => {
  events.user.deleted(user)

  if (isBuilder(user)) {
    events.user.permissionBuilderRemoved(user)
  }

  if (isAdmin(user)) {
    events.user.permissionAdminRemoved(user)
  }
}

const assignAppRoleEvents = (
  user: User,
  roles: UserRoles,
  existingRoles: UserRoles
) => {
  for (const [appId, role] of Object.entries(roles)) {
    // app role in existing is not same as new
    if (!existingRoles || existingRoles[appId] !== role) {
      events.role.assigned(user, role)
    }
  }
}

const unassignAppRoleEvents = (
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
      events.role.unassigned(user, role)
    }
  }
}

const handleAppRoleEvents = (user: any, existingUser: any) => {
  const roles = user.roles
  const existingRoles = existingUser?.roles

  assignAppRoleEvents(user, roles, existingRoles)
  unassignAppRoleEvents(user, roles, existingRoles)
}

export const handleSaveEvents = (user: any, existingUser: any) => {
  if (existingUser) {
    events.user.updated(user)

    if (isRemovingBuilder(user, existingUser)) {
      events.user.permissionBuilderRemoved(user)
    }

    if (isRemovingAdmin(user, existingUser)) {
      events.user.permissionAdminRemoved(user)
    }

    if (
      !existingUser.forceResetPassword &&
      user.forceResetPassword &&
      user.password
    ) {
      events.user.passwordForceReset(user)
    }
  } else {
    events.user.created(user)
  }

  if (isAddingBuilder(user, existingUser)) {
    events.user.permissionBuilderAssigned(user)
  }

  if (isAddingAdmin(user, existingUser)) {
    events.user.permissionAdminAssigned(user)
  }

  handleAppRoleEvents(user, existingUser)
}

const isBuilder = (user: any) => user.builder && user.builder.global
const isAdmin = (user: any) => user.admin && user.admin.global

export const isAddingBuilder = (user: any, existingUser: any) => {
  return isAddingPermission(user, existingUser, isBuilder)
}

export const isRemovingBuilder = (user: any, existingUser: any) => {
  return isRemovingPermission(user, existingUser, isBuilder)
}

const isAddingAdmin = (user: any, existingUser: any) => {
  return isAddingPermission(user, existingUser, isAdmin)
}

const isRemovingAdmin = (user: any, existingUser: any) => {
  return isRemovingPermission(user, existingUser, isAdmin)
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

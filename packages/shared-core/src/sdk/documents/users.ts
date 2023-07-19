import { ContextUser, User } from "@budibase/types"
import { getProdAppID } from "./applications"

// checks if a user is specifically a builder, given an app ID
export function isBuilder(user: User | ContextUser, appId?: string) {
  if (user.builder?.global) {
    return true
  } else if (appId && user.builder?.apps?.includes(getProdAppID(appId))) {
    return true
  }
  return false
}

// alias for hasAdminPermission, currently do the same thing
// in future whether someone has admin permissions and whether they are
// an admin for a specific resource could be separated
export function isAdmin(user: User | ContextUser) {
  return hasAdminPermissions(user)
}

// checks if a user is capable of building any app
export function hasBuilderPermissions(user?: User | ContextUser) {
  if (!user) {
    return false
  }
  return user.builder?.global || user.builder?.apps?.length !== 0
}

// checks if a user is capable of being an admin
export function hasAdminPermissions(user?: User | ContextUser) {
  if (!user) {
    return false
  }
  return user.admin?.global
}

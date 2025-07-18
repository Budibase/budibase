import {
  ContextUser,
  DocumentType,
  SEPARATOR,
  User,
  InternalTable,
  UserGroup,
  UserBuilderInfo,
  UserAdminInfo,
  UserRoleInfo,
} from "@budibase/types"
import { getProdAppID } from "./applications"
import * as _ from "lodash/fp"

// checks if a user is specifically a builder, given an app ID
export function isBuilder(user?: UserBuilderInfo, appId?: string): boolean {
  if (!user) {
    return false
  }
  if (user.builder?.global) {
    return true
  } else if (appId && user.builder?.apps?.includes(getProdAppID(appId))) {
    return true
  }
  return false
}

export function isGlobalBuilder(
  user: UserBuilderInfo & UserAdminInfo
): boolean {
  return (isBuilder(user) && !hasAppBuilderPermissions(user)) || isAdmin(user)
}

export function canCreateApps(user: User | ContextUser): boolean {
  return isGlobalBuilder(user) || hasCreatorPermissions(user)
}

// alias for hasAdminPermission, currently do the same thing
// in future whether someone has admin permissions and whether they are
// an admin for a specific resource could be separated
export function isAdmin(user?: UserAdminInfo): boolean {
  if (!user) {
    return false
  }
  return hasAdminPermissions(user)
}

export function isAdminOrBuilder(
  user: UserBuilderInfo & UserAdminInfo,
  appId?: string
): boolean {
  return isBuilder(user, appId) || isAdmin(user)
}

export function isAdminOrGlobalBuilder(
  user: UserBuilderInfo & UserAdminInfo
): boolean {
  return isGlobalBuilder(user) || isAdmin(user)
}

// check if they are a builder within an app (not necessarily a global builder)
export function hasAppBuilderPermissions(user?: UserBuilderInfo): boolean {
  if (!user) {
    return false
  }
  const appLength = user.builder?.apps?.length
  const isGlobalBuilder = !!user.builder?.global
  return !isGlobalBuilder && appLength != null && appLength > 0
}

export function hasAppCreatorPermissions(
  user?: Partial<UserRoleInfo>
): boolean {
  if (!user) {
    return false
  }
  return _.flow(
    _.get("roles"),
    _.values,
    _.find(x => ["CREATOR"].includes(x)),
    x => !!x
  )(user)
}

// checks if a user is capable of building any app
export function hasBuilderPermissions(user?: UserBuilderInfo): boolean {
  if (!user) {
    return false
  }
  return (
    user.builder?.global ||
    hasAppBuilderPermissions(user) ||
    hasCreatorPermissions(user)
  )
}

// checks if a user is capable of being an admin
export function hasAdminPermissions(user?: UserAdminInfo): boolean {
  if (!user) {
    return false
  }
  return !!user.admin?.global
}

export function hasCreatorPermissions(user?: UserBuilderInfo): boolean {
  if (!user) {
    return false
  }
  return !!user.builder?.creator
}

export function isCreator(
  user?: UserBuilderInfo & UserAdminInfo & Partial<UserRoleInfo>
): boolean {
  if (!user) {
    return false
  }
  return (
    isGlobalBuilder(user!) ||
    hasAdminPermissions(user) ||
    hasCreatorPermissions(user) ||
    hasAppBuilderPermissions(user) ||
    hasAppCreatorPermissions(user)
  )
}

export function getGlobalUserID(userId?: string): string | undefined {
  if (typeof userId !== "string") {
    return userId
  }
  const prefix = `${DocumentType.ROW}${SEPARATOR}${InternalTable.USER_METADATA}${SEPARATOR}`
  if (!userId.startsWith(prefix)) {
    return userId
  }
  return userId.split(prefix)[1]
}

export function containsUserID(value: string | undefined): boolean {
  if (typeof value !== "string") {
    return false
  }
  return value.includes(`${DocumentType.USER}${SEPARATOR}`)
}

export function getUserGroups(user: User, groups?: UserGroup[]) {
  return (
    groups?.filter(group => group.users?.find(u => u._id === user._id)) || []
  )
}

export function getUserAppGroups(
  appId: string,
  user: User,
  groups?: UserGroup[]
) {
  const prodAppId = getProdAppID(appId)
  const userGroups = getUserGroups(user, groups)
  return userGroups.filter(group =>
    Object.keys(group.roles || {}).find(app => app === prodAppId)
  )
}

export function userAppAccessList(user: User, groups?: UserGroup[]) {
  const userGroups = getUserGroups(user, groups)
  const userGroupApps = userGroups.flatMap(userGroup =>
    Object.keys(userGroup.roles || {})
  )
  const fullList = [...Object.keys(user?.roles || {}), ...userGroupApps]
  return [...new Set(fullList)]
}

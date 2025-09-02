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
import { getProdWorkspaceID } from "./workspace"

// checks if a user is specifically a builder, given an workspace ID
export function isBuilder(
  user?: UserBuilderInfo,
  workspaceId?: string
): boolean {
  if (!user) {
    return false
  }
  if (user.builder?.global) {
    return true
  } else if (
    workspaceId &&
    user.builder?.apps?.includes(getProdWorkspaceID(workspaceId))
  ) {
    return true
  }
  return false
}

export function isGlobalBuilder(
  user: UserBuilderInfo & UserAdminInfo
): boolean {
  return (
    (isBuilder(user) && !hasWorkspaceBuilderPermissions(user)) || isAdmin(user)
  )
}

export function canCreateWorkspaces(user: User | ContextUser): boolean {
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
  workspaceId?: string
): boolean {
  return isBuilder(user, workspaceId) || isAdmin(user)
}

export function isAdminOrGlobalBuilder(
  user: UserBuilderInfo & UserAdminInfo
): boolean {
  return isGlobalBuilder(user) || isAdmin(user)
}

// check if they are a builder within a workspace (not necessarily a global builder)
export function hasWorkspaceBuilderPermissions(
  user?: UserBuilderInfo
): boolean {
  if (!user) {
    return false
  }
  const workspaceLength = user.builder?.apps?.length
  const isGlobalBuilder = !!user.builder?.global
  return !isGlobalBuilder && workspaceLength != null && workspaceLength > 0
}

function hasWorkspaceCreatorPermissions(user?: Partial<UserRoleInfo>): boolean {
  if (!user) {
    return false
  }
  return !!Object.values(user.roles ?? {}).find(x => x === "CREATOR")
}

// checks if a user is capable of building any workspace
export function hasBuilderPermissions(user?: UserBuilderInfo): boolean {
  if (!user) {
    return false
  }
  return (
    user.builder?.global ||
    hasWorkspaceBuilderPermissions(user) ||
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
    hasWorkspaceBuilderPermissions(user) ||
    hasWorkspaceCreatorPermissions(user)
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

export function getUserWorkspaceGroups(
  workspaceId: string,
  user: User,
  groups?: UserGroup[]
) {
  const prodWorkspaceId = getProdWorkspaceID(workspaceId)
  const userGroups = getUserGroups(user, groups)
  return userGroups.filter(group =>
    Object.keys(group.roles || {}).find(
      workspace => workspace === prodWorkspaceId
    )
  )
}

export function userWorkspaceAccessList(user: User, groups?: UserGroup[]) {
  const userGroups = getUserGroups(user, groups)
  const userGroupWorkspaces = userGroups.flatMap(userGroup =>
    Object.keys(userGroup.roles || {})
  )
  const fullList = [...Object.keys(user?.roles || {}), ...userGroupWorkspaces]
  return [...new Set(fullList)]
}

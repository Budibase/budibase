import {
  ContextUser,
  DocumentType,
  InternalTable,
  SEPARATOR,
  User,
  UserAdminInfo,
  UserBuilderInfo,
  UserGroup,
  UserRoleInfo,
} from "@budibase/types"
import { getProdWorkspaceID } from "./workspaces"

// Checks whether a user is specifically a builder for a workspace.
// Global builders do not require a workspace-specific permission.
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

export function isAdminOrWorkspaceBuilder(
  user: UserBuilderInfo & UserAdminInfo,
  workspaceId: string
): boolean {
  if (!user) {
    return false
  }

  if (isAdmin(user)) {
    return true
  }

  if (
    workspaceId &&
    user.builder?.apps?.includes(getProdWorkspaceID(workspaceId))
  ) {
    return true
  }

  return false
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

// Checks whether they can build within a workspace without being a global builder.
export function hasAppBuilderPermissions(user?: UserBuilderInfo): boolean {
  if (!user) {
    return false
  }
  const workspaceCount = user.builder?.apps?.length
  const isGlobalBuilder = !!user.builder?.global
  return !isGlobalBuilder && workspaceCount != null && workspaceCount > 0
}

function hasAppCreatorPermissions(user?: Partial<UserRoleInfo>): boolean {
  if (!user) {
    return false
  }
  return !!Object.values(user.roles ?? {}).find(x => x === "CREATOR")
}

// Checks whether a user can build any workspace.
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

function getUserGroups(userId: string | undefined, groups?: UserGroup[]) {
  return groups?.filter(group => group.users?.find(u => u._id === userId)) || []
}

export function getUserAppGroups(
  workspaceId: string,
  userId: string,
  groups?: UserGroup[]
) {
  const prodWorkspaceId = getProdWorkspaceID(workspaceId)
  const userGroups = getUserGroups(userId, groups)
  return userGroups.filter(group =>
    Object.keys(group.roles || {}).find(
      workspaceId => workspaceId === prodWorkspaceId
    )
  )
}

export function userAppAccessList(user: User, groups?: UserGroup[]) {
  const userGroups = getUserGroups(user._id, groups)
  const userGroupWorkspaces = userGroups.flatMap(userGroup =>
    Object.keys(userGroup.roles || {})
  )
  const fullList = [...Object.keys(user?.roles || {}), ...userGroupWorkspaces]
  return [...new Set(fullList)]
}

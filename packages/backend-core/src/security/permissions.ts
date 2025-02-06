import {
  PermissionLevel,
  PermissionType,
  BuiltinPermissionID,
  Permission,
  BuiltinPermissions,
} from "@budibase/types"
import flatten from "lodash/flatten"
import cloneDeep from "lodash/fp/cloneDeep"

export { PermissionType, PermissionLevel } from "@budibase/types"

export type RoleHierarchy = {
  permissionId: string
}[]

export class PermissionImpl implements Permission {
  type: PermissionType
  level: PermissionLevel

  constructor(type: PermissionType, level: PermissionLevel) {
    this.type = type
    this.level = level
  }
}

export function levelToNumber(perm: PermissionLevel) {
  switch (perm) {
    // not everything has execute privileges
    case PermissionLevel.EXECUTE:
      return 0
    case PermissionLevel.READ:
      return 1
    case PermissionLevel.WRITE:
      return 2
    case PermissionLevel.ADMIN:
      return 3
    default:
      return -1
  }
}

/**
 * Given the specified permission level for the user return the levels they are allowed to carry out.
 * @param userPermLevel The permission level of the user.
 * @return All the permission levels this user is allowed to carry out.
 */
export function getAllowedLevels(userPermLevel: PermissionLevel): string[] {
  switch (userPermLevel) {
    case PermissionLevel.EXECUTE:
      return [PermissionLevel.EXECUTE]
    case PermissionLevel.READ:
      return [PermissionLevel.EXECUTE, PermissionLevel.READ]
    case PermissionLevel.WRITE:
    case PermissionLevel.ADMIN:
      return [
        PermissionLevel.EXECUTE,
        PermissionLevel.READ,
        PermissionLevel.WRITE,
      ]
    default:
      return []
  }
}

export const BUILTIN_PERMISSIONS: BuiltinPermissions = {
  PUBLIC: {
    _id: BuiltinPermissionID.PUBLIC,
    name: "Public",
    permissions: [
      new PermissionImpl(PermissionType.WEBHOOK, PermissionLevel.EXECUTE),
    ],
  },
  READ_ONLY: {
    _id: BuiltinPermissionID.READ_ONLY,
    name: "Read only",
    permissions: [
      new PermissionImpl(PermissionType.QUERY, PermissionLevel.READ),
      new PermissionImpl(PermissionType.TABLE, PermissionLevel.READ),
      new PermissionImpl(PermissionType.APP, PermissionLevel.READ),
    ],
  },
  WRITE: {
    _id: BuiltinPermissionID.WRITE,
    name: "Read/Write",
    permissions: [
      new PermissionImpl(PermissionType.QUERY, PermissionLevel.WRITE),
      new PermissionImpl(PermissionType.TABLE, PermissionLevel.WRITE),
      new PermissionImpl(PermissionType.AUTOMATION, PermissionLevel.EXECUTE),
      new PermissionImpl(PermissionType.LEGACY_VIEW, PermissionLevel.READ),
      new PermissionImpl(PermissionType.APP, PermissionLevel.READ),
    ],
  },
  POWER: {
    _id: BuiltinPermissionID.POWER,
    name: "Power",
    permissions: [
      new PermissionImpl(PermissionType.TABLE, PermissionLevel.WRITE),
      new PermissionImpl(PermissionType.USER, PermissionLevel.READ),
      new PermissionImpl(PermissionType.AUTOMATION, PermissionLevel.EXECUTE),
      new PermissionImpl(PermissionType.WEBHOOK, PermissionLevel.READ),
      new PermissionImpl(PermissionType.LEGACY_VIEW, PermissionLevel.READ),
      new PermissionImpl(PermissionType.APP, PermissionLevel.READ),
    ],
  },
  ADMIN: {
    _id: BuiltinPermissionID.ADMIN,
    name: "Admin",
    permissions: [
      new PermissionImpl(PermissionType.TABLE, PermissionLevel.ADMIN),
      new PermissionImpl(PermissionType.USER, PermissionLevel.ADMIN),
      new PermissionImpl(PermissionType.AUTOMATION, PermissionLevel.ADMIN),
      new PermissionImpl(PermissionType.WEBHOOK, PermissionLevel.READ),
      new PermissionImpl(PermissionType.QUERY, PermissionLevel.ADMIN),
      new PermissionImpl(PermissionType.LEGACY_VIEW, PermissionLevel.READ),
      new PermissionImpl(PermissionType.APP, PermissionLevel.READ),
    ],
  },
}

export function getBuiltinPermissions(): BuiltinPermissions {
  return cloneDeep(BUILTIN_PERMISSIONS)
}

export function getBuiltinPermissionByID(id: string) {
  const perms = Object.values(BUILTIN_PERMISSIONS)
  return perms.find(perm => perm._id === id)
}

export function doesHaveBasePermission(
  permType: PermissionType,
  permLevel: PermissionLevel,
  rolesHierarchy: RoleHierarchy
) {
  const basePermissions = [
    ...new Set(rolesHierarchy.map(role => role.permissionId)),
  ]
  const builtins = Object.values(BUILTIN_PERMISSIONS)
  let permissions = flatten(
    builtins
      .filter(builtin => basePermissions.indexOf(builtin._id) !== -1)
      .map(builtin => builtin.permissions)
  )
  for (let permission of permissions) {
    if (
      permission.type === permType &&
      getAllowedLevels(permission.level).indexOf(permLevel) !== -1
    ) {
      return true
    }
  }
  return false
}

export function isPermissionLevelHigherThanRead(level: PermissionLevel) {
  return levelToNumber(level) > 1
}

// utility as a lot of things need simply the builder permission
export const BUILDER = PermissionType.BUILDER
export const CREATOR = PermissionType.CREATOR
export const GLOBAL_BUILDER = PermissionType.GLOBAL_BUILDER

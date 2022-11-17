const { flatten } = require("lodash")
const { cloneDeep } = require("lodash/fp")

export type RoleHierarchy = {
  permissionId: string
}[]

export enum PermissionLevels {
  READ = "read",
  WRITE = "write",
  EXECUTE = "execute",
  ADMIN = "admin",
}

// these are the global types, that govern the underlying default behaviour
export enum PermissionTypes {
  APP = "app",
  TABLE = "table",
  USER = "user",
  AUTOMATION = "automation",
  WEBHOOK = "webhook",
  BUILDER = "builder",
  VIEW = "view",
  QUERY = "query",
}

class Permission {
  type: PermissionTypes
  level: PermissionLevels

  constructor(type: PermissionTypes, level: PermissionLevels) {
    this.type = type
    this.level = level
  }
}

function levelToNumber(perm: PermissionLevels) {
  switch (perm) {
    // not everything has execute privileges
    case PermissionLevels.EXECUTE:
      return 0
    case PermissionLevels.READ:
      return 1
    case PermissionLevels.WRITE:
      return 2
    case PermissionLevels.ADMIN:
      return 3
    default:
      return -1
  }
}

/**
 * Given the specified permission level for the user return the levels they are allowed to carry out.
 * @param {string} userPermLevel The permission level of the user.
 * @return {string[]} All the permission levels this user is allowed to carry out.
 */
function getAllowedLevels(userPermLevel: PermissionLevels) {
  switch (userPermLevel) {
    case PermissionLevels.EXECUTE:
      return [PermissionLevels.EXECUTE]
    case PermissionLevels.READ:
      return [PermissionLevels.EXECUTE, PermissionLevels.READ]
    case PermissionLevels.WRITE:
    case PermissionLevels.ADMIN:
      return [
        PermissionLevels.READ,
        PermissionLevels.WRITE,
        PermissionLevels.EXECUTE,
      ]
    default:
      return []
  }
}

export enum BUILTIN_PERMISSION_IDS {
  PUBLIC = "public",
  READ_ONLY = "read_only",
  WRITE = "write",
  ADMIN = "admin",
  POWER = "power",
}

const BUILTIN_PERMISSIONS = {
  PUBLIC: {
    _id: BUILTIN_PERMISSION_IDS.PUBLIC,
    name: "Public",
    permissions: [
      new Permission(PermissionTypes.WEBHOOK, PermissionLevels.EXECUTE),
    ],
  },
  READ_ONLY: {
    _id: BUILTIN_PERMISSION_IDS.READ_ONLY,
    name: "Read only",
    permissions: [
      new Permission(PermissionTypes.QUERY, PermissionLevels.READ),
      new Permission(PermissionTypes.TABLE, PermissionLevels.READ),
      new Permission(PermissionTypes.VIEW, PermissionLevels.READ),
    ],
  },
  WRITE: {
    _id: BUILTIN_PERMISSION_IDS.WRITE,
    name: "Read/Write",
    permissions: [
      new Permission(PermissionTypes.QUERY, PermissionLevels.WRITE),
      new Permission(PermissionTypes.TABLE, PermissionLevels.WRITE),
      new Permission(PermissionTypes.VIEW, PermissionLevels.READ),
      new Permission(PermissionTypes.AUTOMATION, PermissionLevels.EXECUTE),
    ],
  },
  POWER: {
    _id: BUILTIN_PERMISSION_IDS.POWER,
    name: "Power",
    permissions: [
      new Permission(PermissionTypes.TABLE, PermissionLevels.WRITE),
      new Permission(PermissionTypes.USER, PermissionLevels.READ),
      new Permission(PermissionTypes.AUTOMATION, PermissionLevels.EXECUTE),
      new Permission(PermissionTypes.VIEW, PermissionLevels.READ),
      new Permission(PermissionTypes.WEBHOOK, PermissionLevels.READ),
    ],
  },
  ADMIN: {
    _id: BUILTIN_PERMISSION_IDS.ADMIN,
    name: "Admin",
    permissions: [
      new Permission(PermissionTypes.TABLE, PermissionLevels.ADMIN),
      new Permission(PermissionTypes.USER, PermissionLevels.ADMIN),
      new Permission(PermissionTypes.AUTOMATION, PermissionLevels.ADMIN),
      new Permission(PermissionTypes.VIEW, PermissionLevels.ADMIN),
      new Permission(PermissionTypes.WEBHOOK, PermissionLevels.READ),
      new Permission(PermissionTypes.QUERY, PermissionLevels.ADMIN),
    ],
  },
}

export function getBuiltinPermissions() {
  return cloneDeep(BUILTIN_PERMISSIONS)
}

export function getBuiltinPermissionByID(id: string) {
  const perms = Object.values(BUILTIN_PERMISSIONS)
  return perms.find(perm => perm._id === id)
}

export function doesHaveBasePermission(
  permType: PermissionTypes,
  permLevel: PermissionLevels,
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

export function isPermissionLevelHigherThanRead(level: PermissionLevels) {
  return levelToNumber(level) > 1
}

// utility as a lot of things need simply the builder permission
export const BUILDER = PermissionTypes.BUILDER

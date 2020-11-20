const { flatten } = require("lodash")

const PermissionLevels = {
  READ: "read",
  WRITE: "write",
  EXECUTE: "execute",
  ADMIN: "admin",
}

const PermissionTypes = {
  TABLE: "table",
  USER: "user",
  AUTOMATION: "automation",
  WEBHOOK: "webhook",
  BUILDER: "builder",
  VIEW: "view",
}

function Permission(type, level) {
  this.level = level
  this.type = type
}

/**
 * Given the specified permission level for the user return the levels they are allowed to carry out.
 * @param {string} userPermLevel The permission level of the user.
 * @return {string[]} All the permission levels this user is allowed to carry out.
 */
function getAllowedLevels(userPermLevel) {
  switch (userPermLevel) {
    case PermissionLevels.READ:
      return [PermissionLevels.READ]
    case PermissionLevels.WRITE:
      return [PermissionLevels.READ, PermissionLevels.WRITE]
    case PermissionLevels.EXECUTE:
      return [PermissionLevels.EXECUTE]
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

exports.BUILTIN_PERMISSION_NAMES = {
  READ_ONLY: "read_only",
  WRITE: "write",
  ADMIN: "admin",
  POWER: "power",
}

exports.BUILTIN_PERMISSIONS = {
  READ_ONLY: {
    name: exports.BUILTIN_PERMISSION_NAMES.READ_ONLY,
    permissions: [
      new Permission(PermissionTypes.TABLE, PermissionLevels.READ),
      new Permission(PermissionTypes.VIEW, PermissionLevels.READ),
    ],
  },
  WRITE: {
    name: exports.BUILTIN_PERMISSION_NAMES.WRITE,
    permissions: [
      new Permission(PermissionTypes.TABLE, PermissionLevels.WRITE),
      new Permission(PermissionTypes.VIEW, PermissionLevels.READ),
    ],
  },
  POWER: {
    name: exports.BUILTIN_PERMISSION_NAMES.POWER,
    permissions: [
      new Permission(PermissionTypes.TABLE, PermissionLevels.WRITE),
      new Permission(PermissionTypes.USER, PermissionLevels.READ),
      new Permission(PermissionTypes.AUTOMATION, PermissionLevels.EXECUTE),
      new Permission(PermissionTypes.VIEW, PermissionLevels.READ),
      new Permission(PermissionTypes.WEBHOOK, PermissionLevels.READ),
    ],
  },
  ADMIN: {
    name: exports.BUILTIN_PERMISSION_NAMES.ADMIN,
    permissions: [
      new Permission(PermissionTypes.TABLE, PermissionLevels.ADMIN),
      new Permission(PermissionTypes.USER, PermissionLevels.ADMIN),
      new Permission(PermissionTypes.AUTOMATION, PermissionLevels.ADMIN),
      new Permission(PermissionTypes.VIEW, PermissionLevels.ADMIN),
      new Permission(PermissionTypes.WEBHOOK, PermissionLevels.READ),
    ],
  },
}

exports.doesHavePermission = (permType, permLevel, userPermissionNames) => {
  const builtins = Object.values(exports.BUILTIN_PERMISSIONS)
  let permissions = flatten(
    builtins
      .filter(builtin => userPermissionNames.indexOf(builtin.name) !== -1)
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

// utility as a lot of things need simply the builder permission
exports.BUILDER = PermissionTypes.BUILDER
exports.PermissionTypes = PermissionTypes
exports.PermissionLevels = PermissionLevels

const {
  PermissionLevels,
  PermissionTypes,
  getBuiltinPermissionByID,
  isPermissionLevelHigherThanRead,
} = require("../../utilities/security/permissions")
const {
  lowerBuiltinRoleID,
  getBuiltinRoles,
} = require("../../utilities/security/roles")
const { DocumentTypes } = require("../../db/utils")

const CURRENTLY_SUPPORTED_LEVELS = [
  PermissionLevels.WRITE,
  PermissionLevels.READ,
]

exports.getPermissionType = resourceId => {
  const docType = Object.values(DocumentTypes).filter(docType =>
    resourceId.startsWith(docType)
  )[0]
  switch (docType) {
    case DocumentTypes.TABLE:
    case DocumentTypes.ROW:
      return PermissionTypes.TABLE
    case DocumentTypes.AUTOMATION:
      return PermissionTypes.AUTOMATION
    case DocumentTypes.WEBHOOK:
      return PermissionTypes.WEBHOOK
    case DocumentTypes.QUERY:
    case DocumentTypes.DATASOURCE:
      return PermissionTypes.QUERY
    default:
      // views don't have an ID, will end up here
      return PermissionTypes.VIEW
  }
}

/**
 *  works out the basic permissions based on builtin roles for a resource, using its ID
 * @param resourceId
 * @returns {{}}
 */
exports.getBasePermissions = resourceId => {
  const type = exports.getPermissionType(resourceId)
  const permissions = {}
  for (let [roleId, role] of Object.entries(getBuiltinRoles())) {
    if (!role.permissionId) {
      continue
    }
    const perms = getBuiltinPermissionByID(role.permissionId)
    const typedPermission = perms.permissions.find(perm => perm.type === type)
    if (
      typedPermission &&
      CURRENTLY_SUPPORTED_LEVELS.indexOf(typedPermission.level) !== -1
    ) {
      const level = typedPermission.level
      permissions[level] = lowerBuiltinRoleID(permissions[level], roleId)
      if (isPermissionLevelHigherThanRead(level)) {
        permissions[PermissionLevels.READ] = lowerBuiltinRoleID(
          permissions[PermissionLevels.READ],
          roleId
        )
      }
    }
  }
  return permissions
}

exports.CURRENTLY_SUPPORTED_LEVELS = CURRENTLY_SUPPORTED_LEVELS

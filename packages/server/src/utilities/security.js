const {
  PermissionLevel,
  PermissionType,
  getBuiltinPermissionByID,
  isPermissionLevelHigherThanRead,
} = require("@budibase/backend-core/permissions")
const {
  lowerBuiltinRoleID,
  getBuiltinRoles,
} = require("@budibase/backend-core/roles")
const { DocumentType } = require("../db/utils")

const CURRENTLY_SUPPORTED_LEVELS = [
  PermissionLevel.WRITE,
  PermissionLevel.READ,
  PermissionLevel.EXECUTE,
]

exports.getPermissionType = resourceId => {
  const docType = Object.values(DocumentType).filter(docType =>
    resourceId.startsWith(docType)
  )[0]
  switch (docType) {
    case DocumentType.TABLE:
    case DocumentType.ROW:
      return PermissionType.TABLE
    case DocumentType.AUTOMATION:
      return PermissionType.AUTOMATION
    case DocumentType.WEBHOOK:
      return PermissionType.WEBHOOK
    case DocumentType.QUERY:
    case DocumentType.DATASOURCE:
      return PermissionType.QUERY
    default:
      // views don't have an ID, will end up here
      return PermissionType.VIEW
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
        permissions[PermissionLevel.READ] = lowerBuiltinRoleID(
          permissions[PermissionLevel.READ],
          roleId
        )
      }
    }
  }
  return permissions
}

exports.CURRENTLY_SUPPORTED_LEVELS = CURRENTLY_SUPPORTED_LEVELS

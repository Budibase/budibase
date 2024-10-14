import { DocumentType, permissions, roles } from "@budibase/backend-core"
import { VirtualDocumentType } from "../db/utils"
import { getDocumentType, getVirtualDocumentType } from "@budibase/types"

export const CURRENTLY_SUPPORTED_LEVELS: string[] = [
  permissions.PermissionLevel.WRITE,
  permissions.PermissionLevel.READ,
  permissions.PermissionLevel.EXECUTE,
]

export function getPermissionType(resourceId: string) {
  const virtualDocType = getVirtualDocumentType(resourceId)
  switch (virtualDocType) {
    case VirtualDocumentType.VIEW:
      return permissions.PermissionType.TABLE
  }

  const docType = getDocumentType(resourceId)
  switch (docType) {
    case DocumentType.TABLE:
    case DocumentType.ROW:
    case DocumentType.DATASOURCE_PLUS:
      return permissions.PermissionType.TABLE
    case DocumentType.AUTOMATION:
      return permissions.PermissionType.AUTOMATION
    case DocumentType.WEBHOOK:
      return permissions.PermissionType.WEBHOOK
    case DocumentType.QUERY:
    case DocumentType.DATASOURCE:
      return permissions.PermissionType.QUERY
    default:
      // legacy views don't have an ID, will end up here
      return permissions.PermissionType.LEGACY_VIEW
  }
}

/**
 *  works out the basic permissions based on builtin roles for a resource, using its ID
 */
export function getBasePermissions(resourceId: string): Record<string, string> {
  const type = getPermissionType(resourceId)
  const basePermissions: Record<string, string> = {}
  for (let [roleId, role] of Object.entries(roles.getBuiltinRoles())) {
    if (!role.permissionId) {
      continue
    }

    const perms = permissions.getBuiltinPermissionByID(role.permissionId)
    if (!perms) {
      continue
    }

    const typedPermission = perms.permissions.find(perm => perm.type === type)
    if (!typedPermission) {
      continue
    }

    if (CURRENTLY_SUPPORTED_LEVELS.includes(typedPermission.level)) {
      const level = typedPermission.level
      basePermissions[level] = roles.lowerBuiltinRoleID(
        basePermissions[level],
        roleId
      )
      if (permissions.isPermissionLevelHigherThanRead(level)) {
        basePermissions[permissions.PermissionLevel.READ] =
          roles.lowerBuiltinRoleID(
            basePermissions[permissions.PermissionLevel.READ],
            roleId
          )
      }
    }
  }
  return basePermissions
}

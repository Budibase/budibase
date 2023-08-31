import { context, roles } from "@budibase/backend-core"
import { features } from "@budibase/pro"
import {
  DocumentType,
  PermissionLevel,
  Role,
  VirtualDocumentType,
} from "@budibase/types"
import {
  extractViewInfoFromID,
  getRoleParams,
  isViewID,
} from "../../../db/utils"
import {
  CURRENTLY_SUPPORTED_LEVELS,
  getBasePermissions,
} from "../../../utilities/security"

type ResourceActionAllowedResult =
  | { allowed: true }
  | {
      allowed: false
      level: PermissionLevel
      resourceType: DocumentType | VirtualDocumentType
    }

export async function resourceActionAllowed({
  resourceId,
  level,
}: {
  resourceId: string
  level: PermissionLevel
}): Promise<ResourceActionAllowedResult> {
  if (!isViewID(resourceId)) {
    return { allowed: true }
  }

  if (await features.isViewPermissionEnabled()) {
    return { allowed: true }
  }

  return {
    allowed: false,
    level,
    resourceType: VirtualDocumentType.VIEW,
  }
}

type ResourcePermissions = Record<
  string,
  {
    role: string
    inherited?: boolean | undefined
  }
>

export async function getResourcePerms(
  resourceId: string
): Promise<ResourcePermissions> {
  const db = context.getAppDB()
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  const rolesList = body.rows.map<Role>(row => row.doc)
  let permissions: Record<string, { role: string; inherited?: boolean }> = {}

  let parentResourceToCheck
  if (isViewID(resourceId) && (await features.isViewPermissionEnabled())) {
    parentResourceToCheck = extractViewInfoFromID(resourceId).tableId
  }

  for (let level of CURRENTLY_SUPPORTED_LEVELS) {
    // update the various roleIds in the resource permissions
    for (let role of rolesList) {
      const rolePerms = roles.checkForRoleResourceArray(
        role.permissions,
        resourceId
      )
      if (rolePerms[resourceId]?.indexOf(level) > -1) {
        permissions[level] = {
          role: roles.getExternalRoleID(role._id!, role.version),
        }
      } else if (
        parentResourceToCheck &&
        rolePerms[parentResourceToCheck]?.indexOf(level) > -1
      ) {
        permissions[level] = {
          role: roles.getExternalRoleID(role._id!, role.version),
          inherited: true,
        }
      }
    }
  }

  const basePermissions = Object.entries(
    getBasePermissions(resourceId)
  ).reduce<ResourcePermissions>((p, [level, role]) => {
    p[level] = { role }
    return p
  }, {})
  const result = Object.assign(basePermissions, permissions)
  return result
}

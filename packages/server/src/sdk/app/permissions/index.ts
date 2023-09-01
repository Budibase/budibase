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

enum PermissionType {
  EXPLICIT = "explicit",
  INHERITED = "inherited",
  BASE = "base",
}

type ResourcePermissions = Record<
  string,
  { role: string; type: PermissionType }
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
  let permissions: ResourcePermissions = {}

  let permsToInherit: ResourcePermissions | undefined
  if (isViewID(resourceId) && (await features.isViewPermissionEnabled())) {
    permsToInherit = await getResourcePerms(
      extractViewInfoFromID(resourceId).tableId
    )
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
          type: PermissionType.EXPLICIT,
        }
      } else if (permsToInherit && permsToInherit[level]) {
        permissions[level] = {
          role: permsToInherit[level].role,
          type: PermissionType.INHERITED,
        }
      }
    }
  }

  const basePermissions = Object.entries(
    getBasePermissions(resourceId)
  ).reduce<ResourcePermissions>((p, [level, role]) => {
    p[level] = { role, type: PermissionType.BASE }
    return p
  }, {})
  const result = Object.assign(basePermissions, permissions)
  return result
}

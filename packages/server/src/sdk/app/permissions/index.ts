import { context, roles } from "@budibase/backend-core"
import { features } from "@budibase/pro"
import {
  DocumentType,
  PermissionLevel,
  VirtualDocumentType,
} from "@budibase/types"
import { getRoleParams, isViewID } from "../../../db/utils"
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

export async function getResourcePerms(resourceId: string) {
  const db = context.getAppDB()
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  const rolesList = body.rows.map(row => row.doc)
  let permissions: Record<string, string> = {}
  for (let level of CURRENTLY_SUPPORTED_LEVELS) {
    // update the various roleIds in the resource permissions
    for (let role of rolesList) {
      const rolePerms = roles.checkForRoleResourceArray(
        role.permissions,
        resourceId
      )
      if (
        rolePerms &&
        rolePerms[resourceId] &&
        rolePerms[resourceId].indexOf(level) !== -1
      ) {
        permissions[level] = roles.getExternalRoleID(role._id, role.version)!
      }
    }
  }

  return Object.assign(getBasePermissions(resourceId), permissions)
}

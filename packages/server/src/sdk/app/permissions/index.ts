import { db, env, roles } from "@budibase/backend-core"
import { features } from "@budibase/pro"
import {
  DocumentType,
  PermissionLevel,
  PermissionSource,
  PlanType,
  VirtualDocumentType,
} from "@budibase/types"
import { extractViewInfoFromID, isViewID } from "../../../db/utils"
import {
  CURRENTLY_SUPPORTED_LEVELS,
  getBasePermissions,
} from "../../../utilities/security"
import sdk from "../../../sdk"
import { isV2 } from "../views"

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
  { role: string; type: PermissionSource }
>

export async function getInheritablePermissions(
  resourceId: string
): Promise<ResourcePermissions | undefined> {
  if (isViewID(resourceId)) {
    return await getResourcePerms(extractViewInfoFromID(resourceId).tableId)
  }
}

export async function allowsExplicitPermissions(resourceId: string) {
  if (isViewID(resourceId)) {
    const allowed = await features.isViewPermissionEnabled()
    const minPlan = !allowed ? PlanType.BUSINESS : undefined

    return {
      allowed,
      minPlan,
    }
  }

  return { allowed: true }
}

export async function getResourcePerms(
  resourceId: string
): Promise<ResourcePermissions> {
  const rolesList = await roles.getAllRoles()

  let permissions: ResourcePermissions = {}

  const permsToInherit = await getInheritablePermissions(resourceId)

  const allowsExplicitPerm = (await allowsExplicitPermissions(resourceId))
    .allowed

  for (let level of CURRENTLY_SUPPORTED_LEVELS) {
    // update the various roleIds in the resource permissions
    for (let role of rolesList) {
      const rolePerms = allowsExplicitPerm
        ? roles.checkForRoleResourceArray(role.permissions || {}, resourceId)
        : {}
      if (rolePerms[resourceId]?.indexOf(level) > -1) {
        permissions[level] = {
          role: roles.getExternalRoleID(role._id!, role.version),
          type: PermissionSource.EXPLICIT,
        }
      } else if (
        !permissions[level] &&
        permsToInherit &&
        permsToInherit[level]
      ) {
        permissions[level] = {
          role: permsToInherit[level].role,
          type: PermissionSource.INHERITED,
        }
      }
    }
  }

  const basePermissions = Object.entries(
    getBasePermissions(resourceId)
  ).reduce<ResourcePermissions>((p, [level, role]) => {
    p[level] = { role, type: PermissionSource.BASE }
    return p
  }, {})
  const result = Object.assign(basePermissions, permissions)
  return result
}

export async function getDependantResources(
  resourceId: string
): Promise<Record<string, number> | undefined> {
  if (db.isTableId(resourceId)) {
    const dependants: Record<string, Set<string>> = {}

    const table = await sdk.tables.getTable(resourceId)
    const views = Object.values(table.views || {})

    for (const view of views) {
      if (!isV2(view)) {
        continue
      }

      const permissions = await getResourcePerms(view.id)
      for (const [level, roleInfo] of Object.entries(permissions)) {
        if (roleInfo.type === PermissionSource.INHERITED) {
          dependants[VirtualDocumentType.VIEW] ??= new Set()
          dependants[VirtualDocumentType.VIEW].add(view.id)
        }
      }
    }

    return Object.entries(dependants).reduce((p, [type, resources]) => {
      p[type] = resources.size
      return p
    }, {} as Record<string, number>)
  }

  return
}

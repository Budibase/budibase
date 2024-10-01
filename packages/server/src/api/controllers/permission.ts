import { permissions, roles, context } from "@budibase/backend-core"
import {
  UserCtx,
  Role,
  GetResourcePermsResponse,
  ResourcePermissionInfo,
  GetDependantResourcesResponse,
  AddPermissionResponse,
  AddPermissionRequest,
  RemovePermissionRequest,
  RemovePermissionResponse,
} from "@budibase/types"
import {
  CURRENTLY_SUPPORTED_LEVELS,
  getBasePermissions,
} from "../../utilities/security"
import sdk from "../../sdk"
import { PermissionUpdateType } from "../../sdk/app/permissions"

const SUPPORTED_LEVELS = CURRENTLY_SUPPORTED_LEVELS

export function fetchBuiltin(ctx: UserCtx) {
  ctx.body = Object.values(permissions.getBuiltinPermissions())
}

export function fetchLevels(ctx: UserCtx) {
  // for now only provide the read/write perms externally
  ctx.body = SUPPORTED_LEVELS
}

export async function fetch(ctx: UserCtx) {
  const db = context.getAppDB()
  const dbRoles: Role[] = await sdk.permissions.getAllDBRoles(db)
  let permissions: any = {}
  // create an object with structure role ID -> resource ID -> level
  for (let role of dbRoles) {
    if (!role.permissions) {
      continue
    }
    const roleId = roles.getExternalRoleID(role._id!, role.version)
    if (!roleId) {
      ctx.throw(400, "Unable to retrieve role")
    }
    for (let [resource, levelArr] of Object.entries(role.permissions)) {
      const levels: string[] = Array.isArray(levelArr) ? levelArr : [levelArr]
      const perms: Record<string, string> = {}
      levels.forEach(level => (perms[level] = roleId!))
      permissions[resource] = perms
    }
  }
  // apply the base permissions
  const finalPermissions: Record<string, Record<string, string>> = {}
  for (let [resource, permission] of Object.entries(permissions)) {
    const basePerms = getBasePermissions(resource)
    finalPermissions[resource] = Object.assign(basePerms, permission)
  }
  ctx.body = finalPermissions
}

export async function getResourcePerms(
  ctx: UserCtx<void, GetResourcePermsResponse>
) {
  const resourceId = ctx.params.resourceId
  const resourcePermissions = await sdk.permissions.getResourcePerms(resourceId)
  const inheritablePermissions =
    await sdk.permissions.getInheritablePermissions(resourceId)

  ctx.body = {
    permissions: Object.entries(resourcePermissions).reduce(
      (p, [level, role]) => {
        p[level] = {
          role: role.role,
          permissionType: role.type,
          inheritablePermission:
            inheritablePermissions && inheritablePermissions[level].role,
        }
        return p
      },
      {} as Record<string, ResourcePermissionInfo>
    ),
  }
}

export async function getDependantResources(
  ctx: UserCtx<void, GetDependantResourcesResponse>
) {
  const resourceId = ctx.params.resourceId
  ctx.body = {
    resourceByType: await sdk.permissions.getDependantResources(resourceId),
  }
}

export async function addPermission(ctx: UserCtx<void, AddPermissionResponse>) {
  const params: AddPermissionRequest = ctx.params
  ctx.body = await sdk.permissions.updatePermissionOnRole(
    params,
    PermissionUpdateType.ADD
  )
}

export async function removePermission(
  ctx: UserCtx<void, RemovePermissionResponse>
) {
  const params: RemovePermissionRequest = ctx.params
  ctx.body = await sdk.permissions.updatePermissionOnRole(
    params,
    PermissionUpdateType.REMOVE
  )
}

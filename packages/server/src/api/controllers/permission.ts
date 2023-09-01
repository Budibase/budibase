import { permissions, roles, context, HTTPError } from "@budibase/backend-core"
import {
  UserCtx,
  Database,
  Role,
  PermissionLevel,
  GetResourcePermsResponse,
  ResourcePermissionInfo,
  GetDependantResourcesResponse,
} from "@budibase/types"
import { getRoleParams } from "../../db/utils"
import {
  CURRENTLY_SUPPORTED_LEVELS,
  getBasePermissions,
} from "../../utilities/security"
import { removeFromArray } from "../../utilities"
import sdk from "../../sdk"

const PermissionUpdateType = {
  REMOVE: "remove",
  ADD: "add",
}

const SUPPORTED_LEVELS = CURRENTLY_SUPPORTED_LEVELS

// utility function to stop this repetition - permissions always stored under roles
async function getAllDBRoles(db: Database) {
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  return body.rows.map(row => row.doc)
}

async function updatePermissionOnRole(
  {
    roleId,
    resourceId,
    level,
  }: { roleId: string; resourceId: string; level: PermissionLevel },
  updateType: string
) {
  const allowedAction = await sdk.permissions.resourceActionAllowed({
    resourceId,
    level,
  })

  if (!allowedAction.allowed) {
    throw new HTTPError(
      `You are not allowed to '${allowedAction.level}' the resource type '${allowedAction.resourceType}'`,
      403
    )
  }

  const db = context.getAppDB()
  const remove = updateType === PermissionUpdateType.REMOVE
  const isABuiltin = roles.isBuiltin(roleId)
  const dbRoleId = roles.getDBRoleID(roleId)
  const dbRoles = await getAllDBRoles(db)
  const docUpdates: Role[] = []

  // the permission is for a built in, make sure it exists
  if (isABuiltin && !dbRoles.some(role => role._id === dbRoleId)) {
    const builtin = roles.getBuiltinRoles()[roleId]
    builtin._id = roles.getDBRoleID(builtin._id!)
    dbRoles.push(builtin)
  }

  // now try to find any roles which need updated, e.g. removing the
  // resource from another role and then adding to the new role
  for (let role of dbRoles) {
    let updated = false
    const rolePermissions = role.permissions ? role.permissions : {}
    // make sure its an array, also handle migrating
    if (
      !rolePermissions[resourceId] ||
      !Array.isArray(rolePermissions[resourceId])
    ) {
      rolePermissions[resourceId] =
        typeof rolePermissions[resourceId] === "string"
          ? [rolePermissions[resourceId]]
          : []
    }
    // handle the removal/updating the role which has this permission first
    // the updating (role._id !== dbRoleId) is required because a resource/level can
    // only be permitted in a single role (this reduces hierarchy confusion and simplifies
    // the general UI for this, rather than needing to show everywhere it is used)
    if (
      (role._id !== dbRoleId || remove) &&
      rolePermissions[resourceId].indexOf(level) !== -1
    ) {
      removeFromArray(rolePermissions[resourceId], level)
      updated = true
    }
    // handle the adding, we're on the correct role, at it to this
    if (!remove && role._id === dbRoleId) {
      const set = new Set(rolePermissions[resourceId])
      rolePermissions[resourceId] = [...set.add(level)]
      updated = true
    }
    // handle the update, add it to bulk docs to perform at end
    if (updated) {
      role.permissions = rolePermissions
      docUpdates.push(role)
    }
  }

  const response = await db.bulkDocs(docUpdates)
  return response.map((resp: any) => {
    const version = docUpdates.find(role => role._id === resp.id)?.version
    resp._id = roles.getExternalRoleID(resp.id, version)
    delete resp.id
    return resp
  })
}

export function fetchBuiltin(ctx: UserCtx) {
  ctx.body = Object.values(permissions.getBuiltinPermissions())
}

export function fetchLevels(ctx: UserCtx) {
  // for now only provide the read/write perms externally
  ctx.body = SUPPORTED_LEVELS
}

export async function fetch(ctx: UserCtx) {
  const db = context.getAppDB()
  const dbRoles: Role[] = await getAllDBRoles(db)
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
    requiresPlanToModify: (
      await sdk.permissions.allowsExplicitPermissions(resourceId)
    ).minPlan,
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

export async function addPermission(ctx: UserCtx) {
  ctx.body = await updatePermissionOnRole(ctx.params, PermissionUpdateType.ADD)
}

export async function removePermission(ctx: UserCtx) {
  ctx.body = await updatePermissionOnRole(
    ctx.params,
    PermissionUpdateType.REMOVE
  )
}

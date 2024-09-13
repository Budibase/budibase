import {
  context,
  db as dbCore,
  events,
  roles,
  Header,
} from "@budibase/backend-core"
import { getUserMetadataParams, InternalTables } from "../../db/utils"
import {
  AccessibleRolesResponse,
  Database,
  DestroyRoleResponse,
  FetchRolesResponse,
  FindRoleResponse,
  Role,
  SaveRoleRequest,
  SaveRoleResponse,
  UserCtx,
  UserMetadata,
  DocumentType,
} from "@budibase/types"
import { RoleColor, sdk as sharedSdk } from "@budibase/shared-core"
import sdk from "../../sdk"

const UpdateRolesOptions = {
  CREATED: "created",
  REMOVED: "removed",
}

async function updateRolesOnUserTable(
  db: Database,
  roleId: string,
  updateOption: string,
  roleVersion?: string
) {
  const table = await sdk.tables.getTable(InternalTables.USER_METADATA)
  const constraints = table.schema.roleId?.constraints
  if (!constraints) {
    return
  }
  const updatedRoleId =
    roleVersion === roles.RoleIDVersion.NAME
      ? roles.getExternalRoleID(roleId, roleVersion)
      : roleId
  const indexOfRoleId = constraints.inclusion!.indexOf(updatedRoleId)
  const remove = updateOption === UpdateRolesOptions.REMOVED
  if (remove && indexOfRoleId !== -1) {
    constraints.inclusion!.splice(indexOfRoleId, 1)
  } else if (!remove && indexOfRoleId === -1) {
    constraints.inclusion!.push(updatedRoleId)
  }
  await db.put(table)
}

export async function fetch(ctx: UserCtx<void, FetchRolesResponse>) {
  ctx.body = await roles.getAllRoles()
}

export async function find(ctx: UserCtx<void, FindRoleResponse>) {
  ctx.body = await roles.getRole(ctx.params.roleId)
}

export async function save(ctx: UserCtx<SaveRoleRequest, SaveRoleResponse>) {
  const db = context.getAppDB()
  let { _id, name, inherits, permissionId, version, uiMetadata } =
    ctx.request.body
  let isCreate = false
  const isNewVersion = version === roles.RoleIDVersion.NAME

  if (_id && roles.isBuiltin(_id)) {
    ctx.throw(400, "Cannot update builtin roles.")
  }

  // if not id found, then its creation
  if (!_id) {
    _id = dbCore.generateRoleID(name)
    isCreate = true
  }
  // version 2 roles need updated to add back role_
  else if (isNewVersion) {
    _id = dbCore.prefixRoleID(_id)
  }

  let dbRole: Role | undefined
  if (!isCreate && _id?.startsWith(DocumentType.ROLE)) {
    dbRole = await db.get<Role>(_id)
  }
  if (dbRole && dbRole.name !== name && isNewVersion) {
    ctx.throw(400, "Cannot change custom role name")
  }

  const role = new roles.Role(_id, permissionId, {
    displayName: uiMetadata?.displayName || name,
    description: uiMetadata?.description || "Custom role",
    color: uiMetadata?.color || RoleColor.DEFAULT_CUSTOM,
  }).addInheritance(inherits)
  if (dbRole?.permissions && !role.permissions) {
    role.permissions = dbRole.permissions
  }
  const foundRev = ctx.request.body._rev || dbRole?._rev
  if (foundRev) {
    role._rev = foundRev
  }
  const result = await db.put(role)
  if (isCreate) {
    await events.role.created(role)
  } else {
    await events.role.updated(role)
  }
  await updateRolesOnUserTable(
    db,
    _id,
    UpdateRolesOptions.CREATED,
    role.version
  )
  role._rev = result.rev
  ctx.body = role

  const devDb = context.getDevAppDB()
  const prodDb = context.getProdAppDB()

  if (await prodDb.exists()) {
    const replication = new dbCore.Replication({
      source: devDb.name,
      target: prodDb.name,
    })
    await replication.replicate({
      filter: (doc: any) => {
        return doc._id && doc._id.startsWith("role_")
      },
    })
  }
}

export async function destroy(ctx: UserCtx<void, DestroyRoleResponse>) {
  const db = context.getAppDB()
  let roleId = ctx.params.roleId as string
  if (roles.isBuiltin(roleId)) {
    ctx.throw(400, "Cannot delete builtin role.")
  } else {
    // make sure has the prefix (if it has it then it won't be added)
    roleId = dbCore.generateRoleID(roleId)
  }
  const role = await db.get<Role>(roleId)
  // first check no users actively attached to role
  const users = (
    await db.allDocs<UserMetadata>(
      getUserMetadataParams(undefined, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc!)
  const usersWithRole = users.filter(user => user.roleId === roleId)
  if (usersWithRole.length !== 0) {
    ctx.throw(400, "Cannot delete role when it is in use.")
  }

  await db.remove(roleId, ctx.params.rev)
  await events.role.deleted(role)
  await updateRolesOnUserTable(
    db,
    ctx.params.roleId,
    UpdateRolesOptions.REMOVED,
    role.version
  )
  ctx.message = `Role ${ctx.params.roleId} deleted successfully`
  ctx.status = 200
}

export async function accessible(ctx: UserCtx<void, AccessibleRolesResponse>) {
  let roleId = ctx.user?.roleId
  if (!roleId) {
    roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  }
  if (ctx.user && sharedSdk.users.isAdminOrBuilder(ctx.user)) {
    const appId = context.getAppId()
    if (!appId) {
      ctx.body = []
    } else {
      ctx.body = await roles.getAllRoleIds(appId)
    }
  } else {
    ctx.body = await roles.getUserRoleIdHierarchy(roleId!)
  }

  // If a custom role is provided in the header, filter out higher level roles
  const roleHeader = ctx.header?.[Header.PREVIEW_ROLE] as string
  if (roleHeader && !Object.keys(roles.BUILTIN_ROLE_IDS).includes(roleHeader)) {
    const inherits = (await roles.getRole(roleHeader))?.inherits
    const orderedRoles = ctx.body.reverse()
    let filteredRoles = [roleHeader]
    for (let role of orderedRoles) {
      filteredRoles = [role, ...filteredRoles]
      if (role === inherits) {
        break
      }
    }
    filteredRoles.pop()
    ctx.body = [roleHeader, ...filteredRoles]
  }
}

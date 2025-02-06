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
  DeleteRoleResponse,
  FetchRolesResponse,
  FindRoleResponse,
  Role,
  SaveRoleRequest,
  SaveRoleResponse,
  UserCtx,
  UserMetadata,
  DocumentType,
  BuiltinPermissionID,
} from "@budibase/types"
import { RoleColor, sdk as sharedSdk, helpers } from "@budibase/shared-core"
import sdk from "../../sdk"
import { builderSocket } from "../../websockets"

const UpdateRolesOptions = {
  CREATED: "created",
  REMOVED: "removed",
}

async function removeRoleFromOthers(roleId: string) {
  const allOtherRoles = await roles.getAllRoles()
  const updated: Role[] = []
  for (let role of allOtherRoles) {
    let changed = false
    if (Array.isArray(role.inherits)) {
      const newInherits = role.inherits.filter(
        id => !roles.roleIDsAreEqual(id, roleId)
      )
      changed = role.inherits.length !== newInherits.length
      role.inherits = newInherits
    } else if (role.inherits && roles.roleIDsAreEqual(role.inherits, roleId)) {
      role.inherits = roles.BUILTIN_ROLE_IDS.PUBLIC
      changed = true
    }
    if (changed) {
      updated.push(role)
    }
  }
  if (updated.length) {
    await roles.saveRoles(updated)
  }
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
  ctx.body = (await roles.getAllRoles()).map(role => roles.externalRole(role))
}

export async function find(ctx: UserCtx<void, FindRoleResponse>) {
  const role = await roles.getRole(ctx.params.roleId)
  if (!role) {
    ctx.throw(404, { message: "Role not found" })
  }
  ctx.body = roles.externalRole(role)
}

export async function save(ctx: UserCtx<SaveRoleRequest, SaveRoleResponse>) {
  const db = context.getAppDB()
  let { _id, _rev, name, inherits, permissionId, version, uiMetadata } =
    ctx.request.body
  let isCreate = false
  if (!_rev && !version) {
    version = roles.RoleIDVersion.NAME
  }
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

  const allRoles = (await roles.getAllRoles()).map(role => ({
    ...role,
    _id: dbCore.prefixRoleID(role._id!),
  }))
  let dbRole: Role | undefined
  if (!isCreate && _id?.startsWith(DocumentType.ROLE)) {
    dbRole = allRoles.find(role => role._id === _id)
  }
  if (dbRole && dbRole.name !== name && isNewVersion) {
    ctx.throw(400, "Cannot change custom role name")
  }

  // custom roles should always inherit basic - if they don't inherit anything else
  if (!inherits && roles.validInherits(allRoles, dbRole?.inherits)) {
    inherits = dbRole?.inherits
  } else if (!roles.validInherits(allRoles, inherits)) {
    inherits = [roles.BUILTIN_ROLE_IDS.BASIC]
  }
  // assume write permission level for newly created roles
  if (isCreate && !permissionId) {
    permissionId = BuiltinPermissionID.WRITE
  } else if (!permissionId && dbRole?.permissionId) {
    permissionId = dbRole.permissionId
  }

  if (!permissionId) {
    ctx.throw(400, "Role requires permissionId to be specified.")
  }

  const role = new roles.Role(_id, name, permissionId, {
    displayName: uiMetadata?.displayName || name,
    description: uiMetadata?.description || "Custom role",
    color: uiMetadata?.color || RoleColor.DEFAULT_CUSTOM,
  }).addInheritance(inherits)
  if (dbRole?.permissions && !role.permissions) {
    role.permissions = dbRole.permissions
  }

  // add the new role to the list and check for loops
  const index = allRoles.findIndex(r => r._id === role._id)
  if (index === -1) {
    allRoles.push(role)
  } else {
    allRoles[index] = role
  }
  if (helpers.roles.checkForRoleInheritanceLoops(allRoles)) {
    ctx.throw(400, "Role inheritance contains a loop, this is not supported")
  }

  const foundRev = _rev || dbRole?._rev
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
  ctx.body = roles.externalRole(role)

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
  builderSocket?.emitRoleUpdate(ctx, role)
}

export async function destroy(ctx: UserCtx<void, DeleteRoleResponse>) {
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

  // clean up inherits
  await removeRoleFromOthers(roleId)

  ctx.body = { message: `Role ${ctx.params.roleId} deleted successfully` }
  builderSocket?.emitRoleDeletion(ctx, role)
}

export async function accessible(ctx: UserCtx<void, AccessibleRolesResponse>) {
  let roleId = ctx.user?.roleId
  if (!roleId) {
    roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  }
  // If a custom role is provided in the header, filter out higher level roles
  const roleHeader = ctx.header[Header.PREVIEW_ROLE]
  if (Array.isArray(roleHeader)) {
    ctx.throw(400, `Too many roles specified in ${Header.PREVIEW_ROLE} header`)
  }
  const isBuilder = ctx.user && sharedSdk.users.isAdminOrBuilder(ctx.user)
  let roleIds: string[] = []
  if (!roleHeader && isBuilder) {
    const appId = context.getAppId()
    if (appId) {
      roleIds = await roles.getAllRoleIds(appId)
    }
  } else if (isBuilder && roleHeader) {
    roleIds = await roles.getUserRoleIdHierarchy(roleHeader)
  } else {
    roleIds = await roles.getUserRoleIdHierarchy(roleId!)
  }

  ctx.body = roleIds.map(roleId => roles.getExternalRoleID(roleId))
}

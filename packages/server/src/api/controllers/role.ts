import { context, db as dbCore, events, roles } from "@budibase/backend-core"
import { getUserMetadataParams, InternalTables } from "../../db/utils"
import { Database, Role, UserCtx, UserRoles } from "@budibase/types"
import { sdk as sharedSdk } from "@budibase/shared-core"
import sdk from "../../sdk"

const UpdateRolesOptions = {
  CREATED: "created",
  REMOVED: "removed",
}

async function updateRolesOnUserTable(
  db: Database,
  roleId: string,
  updateOption: string,
  roleVersion: string | undefined
) {
  const table = await sdk.tables.getTable(InternalTables.USER_METADATA)
  const schema = table.schema
  const remove = updateOption === UpdateRolesOptions.REMOVED
  let updated = false
  for (let prop of Object.keys(schema)) {
    if (prop === "roleId") {
      updated = true
      const constraints = schema[prop].constraints!
      const updatedRoleId =
        roleVersion === roles.RoleIDVersion.NAME
          ? roles.getExternalRoleID(roleId, roleVersion)
          : roleId
      const indexOfRoleId = constraints.inclusion!.indexOf(updatedRoleId)
      if (remove && indexOfRoleId !== -1) {
        constraints.inclusion!.splice(indexOfRoleId, 1)
      } else if (!remove && indexOfRoleId === -1) {
        constraints.inclusion!.push(updatedRoleId)
      }
      break
    }
  }
  if (updated) {
    await db.put(table)
  }
}

export async function fetch(ctx: UserCtx) {
  ctx.body = await roles.getAllRoles()
}

export async function find(ctx: UserCtx) {
  ctx.body = await roles.getRole(ctx.params.roleId)
}

export async function save(ctx: UserCtx) {
  const db = context.getAppDB()
  let { _id, name, inherits, permissionId, version } = ctx.request.body
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

  let dbRole
  if (!isCreate) {
    dbRole = await db.get<UserRoles>(_id)
  }
  if (dbRole && dbRole.name !== name && isNewVersion) {
    ctx.throw(400, "Cannot change custom role name")
  }

  const role = new roles.Role(_id, name, permissionId).addInheritance(inherits)
  if (ctx.request.body._rev) {
    role._rev = ctx.request.body._rev
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
}

export async function destroy(ctx: UserCtx) {
  const db = context.getAppDB()
  let roleId = ctx.params.roleId
  if (roles.isBuiltin(roleId)) {
    ctx.throw(400, "Cannot delete builtin role.")
  } else {
    // make sure has the prefix (if it has it then it won't be added)
    roleId = dbCore.generateRoleID(roleId)
  }
  const role = await db.get<Role>(roleId)
  // first check no users actively attached to role
  const users = (
    await db.allDocs(
      getUserMetadataParams(undefined, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
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

export async function accessible(ctx: UserCtx) {
  let roleId = ctx.user?.roleId
  if (!roleId) {
    roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  }
  if (ctx.user && sharedSdk.users.isAdminOrBuilder(ctx.user)) {
    const appId = context.getAppId()
    ctx.body = await roles.getAllRoleIds(appId)
  } else {
    ctx.body = await roles.getUserRoleIdHierarchy(roleId!)
  }
}

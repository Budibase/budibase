import { roles, context, events } from "@budibase/backend-core"
import {
  generateRoleID,
  getUserMetadataParams,
  InternalTables,
} from "../../db/utils"
import { BBContext, Database } from "@budibase/types"

const UpdateRolesOptions = {
  CREATED: "created",
  REMOVED: "removed",
}

async function updateRolesOnUserTable(
  db: Database,
  roleId: string,
  updateOption: string
) {
  const table = await db.get(InternalTables.USER_METADATA)
  const schema = table.schema
  const remove = updateOption === UpdateRolesOptions.REMOVED
  let updated = false
  for (let prop of Object.keys(schema)) {
    if (prop === "roleId") {
      updated = true
      const constraints = schema[prop].constraints
      const indexOf = constraints.inclusion.indexOf(roleId)
      if (remove && indexOf !== -1) {
        constraints.inclusion.splice(indexOf, 1)
      } else if (!remove && indexOf === -1) {
        constraints.inclusion.push(roleId)
      }
      break
    }
  }
  if (updated) {
    await db.put(table)
  }
}

export async function fetch(ctx: BBContext) {
  ctx.body = await roles.getAllRoles()
}

export async function find(ctx: BBContext) {
  ctx.body = await roles.getRole(ctx.params.roleId)
}

export async function save(ctx: BBContext) {
  const db = context.getAppDB()
  let { _id, name, inherits, permissionId } = ctx.request.body
  let isCreate = false
  if (!_id) {
    _id = generateRoleID()
    isCreate = true
  } else if (roles.isBuiltin(_id)) {
    ctx.throw(400, "Cannot update builtin roles.")
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
  await updateRolesOnUserTable(db, _id, UpdateRolesOptions.CREATED)
  role._rev = result.rev
  ctx.body = role
  ctx.message = `Role '${role.name}' created successfully.`
}

export async function destroy(ctx: BBContext) {
  const db = context.getAppDB()
  const roleId = ctx.params.roleId
  const role = await db.get(roleId)
  if (roles.isBuiltin(roleId)) {
    ctx.throw(400, "Cannot delete builtin role.")
  }
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
    UpdateRolesOptions.REMOVED
  )
  ctx.message = `Role ${ctx.params.roleId} deleted successfully`
  ctx.status = 200
}

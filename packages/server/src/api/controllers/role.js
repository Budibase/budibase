const {
  Role,
  getRole,
  isBuiltin,
  getAllRoles,
} = require("@budibase/backend-core/roles")
const {
  generateRoleID,
  getUserMetadataParams,
  InternalTables,
} = require("../../db/utils")
const { getAppDB } = require("@budibase/backend-core/context")
const { events } = require("@budibase/backend-core")

const UpdateRolesOptions = {
  CREATED: "created",
  REMOVED: "removed",
}

async function updateRolesOnUserTable(db, roleId, updateOption) {
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

exports.fetch = async function (ctx) {
  ctx.body = await getAllRoles()
}

exports.find = async function (ctx) {
  ctx.body = await getRole(ctx.params.roleId)
}

exports.save = async function (ctx) {
  const db = getAppDB()
  let { _id, name, inherits, permissionId } = ctx.request.body
  let isCreate = false
  if (!_id) {
    _id = generateRoleID()
    isCreate = true
  } else if (isBuiltin(_id)) {
    ctx.throw(400, "Cannot update builtin roles.")
  }
  const role = new Role(_id, name)
    .addPermission(permissionId)
    .addInheritance(inherits)
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

exports.destroy = async function (ctx) {
  const db = getAppDB()
  const roleId = ctx.params.roleId
  const role = await db.get(roleId)
  if (isBuiltin(roleId)) {
    ctx.throw(400, "Cannot delete builtin role.")
  }
  // first check no users actively attached to role
  const users = (
    await db.allDocs(
      getUserMetadataParams(null, {
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

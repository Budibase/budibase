const CouchDB = require("../../db")
const {
  getBuiltinRoles,
  BUILTIN_ROLE_IDS,
  Role,
  getRole,
  isBuiltin,
  getExternalRoleID,
} = require("../../utilities/security/roles")
const {
  generateRoleID,
  getRoleParams,
  getUserParams,
  ViewNames,
} = require("../../db/utils")

const UpdateRolesOptions = {
  CREATED: "created",
  REMOVED: "removed",
}

// exclude internal roles like builder
const EXTERNAL_BUILTIN_ROLE_IDS = [
  BUILTIN_ROLE_IDS.ADMIN,
  BUILTIN_ROLE_IDS.POWER,
  BUILTIN_ROLE_IDS.BASIC,
  BUILTIN_ROLE_IDS.PUBLIC,
]

async function updateRolesOnUserTable(db, roleId, updateOption) {
  const table = await db.get(ViewNames.USERS)
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

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  let roles = body.rows.map(row => row.doc)
  const builtinRoles = getBuiltinRoles()

  // need to combine builtin with any DB record of them (for sake of permissions)
  for (let builtinRoleId of EXTERNAL_BUILTIN_ROLE_IDS) {
    const builtinRole = builtinRoles[builtinRoleId]
    const dbBuiltin = roles.filter(
      dbRole => getExternalRoleID(dbRole._id) === builtinRoleId
    )[0]
    if (dbBuiltin == null) {
      roles.push(builtinRole)
    } else {
      // remove role and all back after combining with the builtin
      roles = roles.filter(role => role._id !== dbBuiltin._id)
      dbBuiltin._id = getExternalRoleID(dbBuiltin._id)
      roles.push(Object.assign(builtinRole, dbBuiltin))
    }
  }
  ctx.body = roles
}

exports.find = async function(ctx) {
  ctx.body = await getRole(ctx.user.appId, ctx.params.roleId)
}

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  let { _id, name, inherits, permissionId } = ctx.request.body
  if (!_id) {
    _id = generateRoleID()
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
  await updateRolesOnUserTable(db, _id, UpdateRolesOptions.CREATED)
  role._rev = result.rev
  ctx.body = role
  ctx.message = `Role '${role.name}' created successfully.`
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const roleId = ctx.params.roleId
  if (isBuiltin(roleId)) {
    ctx.throw(400, "Cannot delete builtin role.")
  }
  // first check no users actively attached to role
  const users = (
    await db.allDocs(
      getUserParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
  const usersWithRole = users.filter(user => user.roleId === roleId)
  if (usersWithRole.length !== 0) {
    ctx.throw(400, "Cannot delete role when it is in use.")
  }

  await db.remove(roleId, ctx.params.rev)
  await updateRolesOnUserTable(
    db,
    ctx.params.roleId,
    UpdateRolesOptions.REMOVED
  )
  ctx.message = `Role ${ctx.params.roleId} deleted successfully`
  ctx.status = 200
}

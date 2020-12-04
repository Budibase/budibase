const CouchDB = require("../../db")
const {
  BUILTIN_ROLES,
  Role,
  getRole,
} = require("../../utilities/security/roles")
const { generateRoleID, getRoleParams } = require("../../db/utils")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  const customRoles = body.rows.map(row => row.doc)

  // exclude internal roles like builder
  const staticRoles = [
    BUILTIN_ROLES.ADMIN,
    BUILTIN_ROLES.POWER,
    BUILTIN_ROLES.BASIC,
    BUILTIN_ROLES.PUBLIC,
  ]
  ctx.body = [...staticRoles, ...customRoles]
}

exports.find = async function(ctx) {
  ctx.body = await getRole(ctx.user.appId, ctx.params.roleId)
}

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  let { _id, name, inherits, permissionId } = ctx.request.body
  if (!_id) {
    _id = generateRoleID()
  }
  const role = new Role(_id, name)
    .addPermission(permissionId)
    .addInheritance(inherits)
  if (ctx.request.body._rev) {
    role._rev = ctx.request.body._rev
  }
  const result = await db.put(role)
  role._rev = result.rev
  ctx.body = role
  ctx.message = `Role '${role.name}' created successfully.`
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  await db.remove(ctx.params.roleId, ctx.params.rev)
  ctx.message = `Role ${ctx.params.roleId} deleted successfully`
  ctx.status = 200
}

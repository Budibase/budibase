const {
  BUILTIN_PERMISSIONS,
  PermissionLevels,
} = require("../../utilities/security/permissions")
const { getRoleParams } = require("../../db/utils")
const CouchDB = require("../../db")

async function updatePermissionOnRole(
  appId,
  roleId,
  permissions,
  remove = false
) {
  const db = new CouchDB(appId)
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  const dbRoles = body.rows.map(row => row.doc)
  const docUpdates = []

  // now try to find any roles which need updated, e.g. removing the
  // resource from another role and then adding to the new role
  for (let role of dbRoles) {
    if (role.permissions) {
      // TODO
    }
  }

  // TODO: NEED TO WORK THIS PART OUT
  return await db.bulkDocs(docUpdates)
}

exports.fetchBuiltin = function(ctx) {
  ctx.body = Object.values(BUILTIN_PERMISSIONS)
}

exports.fetchLevels = function(ctx) {
  ctx.body = Object.values(PermissionLevels)
}

exports.addPermission = async function(ctx) {
  const appId = ctx.appId,
    roleId = ctx.params.roleId,
    resourceId = ctx.params.resourceId
  ctx.body = await updatePermissionOnRole(appId, roleId, resourceId)
}

exports.removePermission = async function(ctx) {
  const appId = ctx.appId,
    roleId = ctx.params.roleId,
    resourceId = ctx.params.resourceId
  ctx.body = await updatePermissionOnRole(appId, roleId, resourceId, true)
}

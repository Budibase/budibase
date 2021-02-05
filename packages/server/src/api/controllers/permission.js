const {
  BUILTIN_PERMISSIONS,
  PermissionLevels,
} = require("../../utilities/security/permissions")

function updatePermissionOnRole(roleId, permissions, remove = false) {

}

exports.fetchBuiltin = function(ctx) {
  ctx.body = Object.values(BUILTIN_PERMISSIONS)
}

exports.fetchLevels = function(ctx) {
  ctx.body = Object.values(PermissionLevels)
}

exports.addPermission = async function(ctx) {
  const permissions = ctx.body.permissions, appId = ctx.appId
  updatePermissionOnRole
}

exports.removePermission = async function(ctx) {
  const permissions = ctx.body.permissions, appId = ctx.appId
}

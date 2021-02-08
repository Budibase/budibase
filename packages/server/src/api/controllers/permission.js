const {
  BUILTIN_PERMISSIONS,
  PermissionLevels,
  higherPermission,
} = require("../../utilities/security/permissions")
const { getRoleParams } = require("../../db/utils")
const CouchDB = require("../../db")

const PermissionUpdateType = {
  REMOVE: "remove",
  ADD: "add",
}

async function updatePermissionOnRole(
  appId,
  { roleId, resourceId, level },
  updateType
) {
  const db = new CouchDB(appId)
  const remove = updateType === PermissionUpdateType.REMOVE
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  const dbRoles = body.rows.map(row => row.doc)
  const docUpdates = []

  // TODO NEED TO HANDLE BUILTINS HERE - THE dbRoles doesn't contain them

  // now try to find any roles which need updated, e.g. removing the
  // resource from another role and then adding to the new role
  for (let role of dbRoles) {
    let updated = false
    const rolePermissions = role.permissions ? role.permissions : {}
    // handle the removal/updating the role which has this permission first
    // the updating (role._id !== roleId) is required because a resource/level can
    // only be permitted in a single role (this reduces hierarchy confusion and simplifies
    // the general UI for this, rather than needing to show everywhere it is used)
    if (
      (role._id !== roleId || remove) &&
      rolePermissions[resourceId] === level
    ) {
      delete rolePermissions[resourceId]
      updated = true
    }
    // handle the adding, we're on the correct role, at it to this
    if (!remove && role._id === roleId) {
      rolePermissions[resourceId] = level
      updated = true
    }
    // handle the update, add it to bulk docs to perform at end
    if (updated) {
      role.permissions = rolePermissions
      docUpdates.push(role)
    }
  }

  return db.bulkDocs(docUpdates)
}

exports.fetchBuiltin = function(ctx) {
  ctx.body = Object.values(BUILTIN_PERMISSIONS)
}

exports.fetchLevels = function(ctx) {
  // for now only provide the read/write perms externally
  ctx.body = [PermissionLevels.WRITE, PermissionLevels.READ]
}

exports.getResourcePerms = async function(ctx) {
  const resourceId = ctx.params.resourceId
  const db = new CouchDB(ctx.appId)
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  const roles = body.rows.map(row => row.doc)
  const resourcePerms = {}
  for (let role of roles) {
    // update the various roleIds in the resource permissions
    if (role.permissions && role.permissions[resourceId]) {
      resourcePerms[role._id] = higherPermission(
        resourcePerms[role._id],
        role.permissions[resourceId]
      )
    }
  }
  ctx.body = resourcePerms
}

exports.addPermission = async function(ctx) {
  ctx.body = await updatePermissionOnRole(
    ctx.appId,
    ctx.params,
    PermissionUpdateType.ADD
  )
}

exports.removePermission = async function(ctx) {
  ctx.body = await updatePermissionOnRole(
    ctx.appId,
    ctx.params,
    PermissionUpdateType.REMOVE
  )
}

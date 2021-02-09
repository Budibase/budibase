const {
  BUILTIN_PERMISSIONS,
  PermissionLevels,
  higherPermission,
} = require("../../utilities/security/permissions")
const {
  isBuiltin,
  getDBRoleID,
  getExternalRoleID,
  BUILTIN_ROLES,
} = require("../../utilities/security/roles")
const { getRoleParams } = require("../../db/utils")
const CouchDB = require("../../db")
const { cloneDeep } = require("lodash/fp")

const PermissionUpdateType = {
  REMOVE: "remove",
  ADD: "add",
}

// utility function to stop this repetition - permissions always stored under roles
async function getAllDBRoles(db) {
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  return body.rows.map(row => row.doc)
}

async function updatePermissionOnRole(
  appId,
  { roleId, resourceId, level },
  updateType
) {
  const db = new CouchDB(appId)
  const remove = updateType === PermissionUpdateType.REMOVE
  const isABuiltin = isBuiltin(roleId)
  const dbRoleId = getDBRoleID(roleId)
  const dbRoles = await getAllDBRoles(db)
  const docUpdates = []

  // the permission is for a built in, make sure it exists
  if (isABuiltin && !dbRoles.some(role => role._id === dbRoleId)) {
    const builtin = cloneDeep(BUILTIN_ROLES[roleId])
    builtin._id = getDBRoleID(builtin._id)
    dbRoles.push(builtin)
  }

  // now try to find any roles which need updated, e.g. removing the
  // resource from another role and then adding to the new role
  for (let role of dbRoles) {
    let updated = false
    const rolePermissions = role.permissions ? role.permissions : {}
    // handle the removal/updating the role which has this permission first
    // the updating (role._id !== dbRoleId) is required because a resource/level can
    // only be permitted in a single role (this reduces hierarchy confusion and simplifies
    // the general UI for this, rather than needing to show everywhere it is used)
    if (
      (role._id !== dbRoleId || remove) &&
      rolePermissions[resourceId] === level
    ) {
      delete rolePermissions[resourceId]
      updated = true
    }
    // handle the adding, we're on the correct role, at it to this
    if (!remove && role._id === dbRoleId) {
      rolePermissions[resourceId] = level
      updated = true
    }
    // handle the update, add it to bulk docs to perform at end
    if (updated) {
      role.permissions = rolePermissions
      docUpdates.push(role)
    }
  }

  const response = await db.bulkDocs(docUpdates)
  return response.map(resp => {
    resp._id = getExternalRoleID(resp.id)
    delete resp.id
    return resp
  })
}

exports.fetchBuiltin = function(ctx) {
  ctx.body = Object.values(BUILTIN_PERMISSIONS)
}

exports.fetchLevels = function(ctx) {
  // for now only provide the read/write perms externally
  ctx.body = [PermissionLevels.WRITE, PermissionLevels.READ]
}

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.appId)
  const roles = await getAllDBRoles(db)
  let permissions = {}
  // create an object with structure role ID -> resource ID -> level
  for (let role of roles) {
    if (role.permissions) {
      const roleId = getExternalRoleID(role._id)
      if (permissions[roleId] == null) {
        permissions[roleId] = {}
      }
      for (let [resource, level] of Object.entries(role.permissions)) {
        permissions[roleId][resource] = higherPermission(
          permissions[roleId][resource],
          level
        )
      }
    }
  }
  ctx.body = permissions
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
      const roleId = getExternalRoleID(role._id)
      resourcePerms[roleId] = higherPermission(
        resourcePerms[roleId],
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

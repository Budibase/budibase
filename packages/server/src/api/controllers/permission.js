const { getBuiltinPermissions } = require("@budibase/backend-core/permissions")
const {
  isBuiltin,
  getDBRoleID,
  getExternalRoleID,
  getBuiltinRoles,
  checkForRoleResourceArray,
} = require("@budibase/backend-core/roles")
const { getRoleParams } = require("../../db/utils")
const {
  CURRENTLY_SUPPORTED_LEVELS,
  getBasePermissions,
} = require("../../utilities/security")
const { removeFromArray } = require("../../utilities")
const { getAppDB } = require("@budibase/backend-core/context")

const PermissionUpdateType = {
  REMOVE: "remove",
  ADD: "add",
}

const SUPPORTED_LEVELS = CURRENTLY_SUPPORTED_LEVELS

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
  const db = getAppDB()
  const remove = updateType === PermissionUpdateType.REMOVE
  const isABuiltin = isBuiltin(roleId)
  const dbRoleId = getDBRoleID(roleId)
  const dbRoles = await getAllDBRoles(db)
  const docUpdates = []

  // the permission is for a built in, make sure it exists
  if (isABuiltin && !dbRoles.some(role => role._id === dbRoleId)) {
    const builtin = getBuiltinRoles()[roleId]
    builtin._id = getDBRoleID(builtin._id)
    dbRoles.push(builtin)
  }

  // now try to find any roles which need updated, e.g. removing the
  // resource from another role and then adding to the new role
  for (let role of dbRoles) {
    let updated = false
    const rolePermissions = role.permissions ? role.permissions : {}
    // make sure its an array, also handle migrating
    if (
      !rolePermissions[resourceId] ||
      !Array.isArray(rolePermissions[resourceId])
    ) {
      rolePermissions[resourceId] =
        typeof rolePermissions[resourceId] === "string"
          ? [rolePermissions[resourceId]]
          : []
    }
    // handle the removal/updating the role which has this permission first
    // the updating (role._id !== dbRoleId) is required because a resource/level can
    // only be permitted in a single role (this reduces hierarchy confusion and simplifies
    // the general UI for this, rather than needing to show everywhere it is used)
    if (
      (role._id !== dbRoleId || remove) &&
      rolePermissions[resourceId].indexOf(level) !== -1
    ) {
      removeFromArray(rolePermissions[resourceId], level)
      updated = true
    }
    // handle the adding, we're on the correct role, at it to this
    if (!remove && role._id === dbRoleId) {
      const set = new Set(rolePermissions[resourceId])
      rolePermissions[resourceId] = [...set.add(level)]
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

exports.fetchBuiltin = function (ctx) {
  ctx.body = Object.values(getBuiltinPermissions())
}

exports.fetchLevels = function (ctx) {
  // for now only provide the read/write perms externally
  ctx.body = SUPPORTED_LEVELS
}

exports.fetch = async function (ctx) {
  const db = getAppDB()
  const roles = await getAllDBRoles(db)
  let permissions = {}
  // create an object with structure role ID -> resource ID -> level
  for (let role of roles) {
    if (!role.permissions) {
      continue
    }
    const roleId = getExternalRoleID(role._id)
    for (let [resource, levelArr] of Object.entries(role.permissions)) {
      const levels = Array.isArray(levelArr) ? [levelArr] : levelArr
      const perms = {}
      levels.forEach(level => (perms[level] = roleId))
      permissions[resource] = perms
    }
  }
  // apply the base permissions
  const finalPermissions = {}
  for (let [resource, permission] of Object.entries(permissions)) {
    const basePerms = getBasePermissions(resource)
    finalPermissions[resource] = Object.assign(basePerms, permission)
  }
  ctx.body = finalPermissions
}

exports.getResourcePerms = async function (ctx) {
  const resourceId = ctx.params.resourceId
  const db = getAppDB()
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  const roles = body.rows.map(row => row.doc)
  let permissions = {}
  for (let level of SUPPORTED_LEVELS) {
    // update the various roleIds in the resource permissions
    for (let role of roles) {
      const rolePerms = checkForRoleResourceArray(role.permissions, resourceId)
      if (
        rolePerms &&
        rolePerms[resourceId] &&
        rolePerms[resourceId].indexOf(level) !== -1
      ) {
        permissions[level] = getExternalRoleID(role._id)
      }
    }
  }
  ctx.body = Object.assign(getBasePermissions(resourceId), permissions)
}

exports.addPermission = async function (ctx) {
  ctx.body = await updatePermissionOnRole(
    ctx.appId,
    ctx.params,
    PermissionUpdateType.ADD
  )
}

exports.removePermission = async function (ctx) {
  ctx.body = await updatePermissionOnRole(
    ctx.appId,
    ctx.params,
    PermissionUpdateType.REMOVE
  )
}

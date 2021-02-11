const {
  BUILTIN_PERMISSIONS,
  PermissionLevels,
  PermissionTypes,
  higherPermission,
  getBuiltinPermissionByID,
  isPermissionLevelHigherThanRead,
} = require("../../utilities/security/permissions")
const {
  isBuiltin,
  getDBRoleID,
  getExternalRoleID,
  lowerBuiltinRoleID,
  BUILTIN_ROLES,
} = require("../../utilities/security/roles")
const { getRoleParams, DocumentTypes } = require("../../db/utils")
const CouchDB = require("../../db")
const { cloneDeep } = require("lodash/fp")

const PermissionUpdateType = {
  REMOVE: "remove",
  ADD: "add",
}

const SUPPORTED_LEVELS = [PermissionLevels.WRITE, PermissionLevels.READ]

function getPermissionType(resourceId) {
  const docType = Object.values(DocumentTypes).filter(docType =>
    resourceId.startsWith(docType)
  )[0]
  switch (docType) {
    case DocumentTypes.TABLE:
    case DocumentTypes.ROW:
      return PermissionTypes.TABLE
    case DocumentTypes.AUTOMATION:
      return PermissionTypes.AUTOMATION
    case DocumentTypes.WEBHOOK:
      return PermissionTypes.WEBHOOK
    case DocumentTypes.QUERY:
    case DocumentTypes.DATASOURCE:
      return PermissionTypes.QUERY
    default:
      // views don't have an ID, will end up here
      return PermissionTypes.VIEW
  }
}

function getBasePermissions(resourceId) {
  const type = getPermissionType(resourceId)
  const permissions = {}
  for (let [roleId, role] of Object.entries(BUILTIN_ROLES)) {
    if (!role.permissionId) {
      continue
    }
    const perms = getBuiltinPermissionByID(role.permissionId)
    const typedPermission = perms.permissions.find(perm => perm.type === type)
    if (
      typedPermission &&
      SUPPORTED_LEVELS.indexOf(typedPermission.level) !== -1
    ) {
      const level = typedPermission.level
      permissions[level] = lowerBuiltinRoleID(permissions[level], roleId)
      if (isPermissionLevelHigherThanRead(level)) {
        permissions[PermissionLevels.READ] = lowerBuiltinRoleID(
          permissions[PermissionLevels.READ],
          roleId
        )
      }
    }
  }
  return permissions
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
  ctx.body = SUPPORTED_LEVELS
}

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.appId)
  const roles = await getAllDBRoles(db)
  let permissions = {}
  // create an object with structure role ID -> resource ID -> level
  for (let role of roles) {
    if (!role.permissions) {
      continue
    }
    const roleId = getExternalRoleID(role._id)
    for (let [resource, level] of Object.entries(role.permissions)) {
      if (permissions[resource] == null) {
        permissions[resource] = getBasePermissions(resource)
      }
      permissions[resource][level] = roleId
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
  const resourcePerms = getBasePermissions(resourceId)
  for (let level of SUPPORTED_LEVELS) {
    // update the various roleIds in the resource permissions
    for (let role of roles) {
      if (role.permissions && role.permissions[resourceId] === level) {
        resourcePerms[level] = getExternalRoleID(role._id)
      }
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

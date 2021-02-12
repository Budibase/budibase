const CouchDB = require("../../db")
const { cloneDeep } = require("lodash/fp")
const { BUILTIN_PERMISSION_IDS, higherPermission } = require("./permissions")
const { generateRoleID, DocumentTypes, SEPARATOR } = require("../../db/utils")

const BUILTIN_IDS = {
  ADMIN: "ADMIN",
  POWER: "POWER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
  BUILDER: "BUILDER",
}

function Role(id, name) {
  this._id = id
  this.name = name
}

Role.prototype.addPermission = function(permissionId) {
  this.permissionId = permissionId
  return this
}

Role.prototype.addInheritance = function(inherits) {
  this.inherits = inherits
  return this
}

exports.BUILTIN_ROLES = {
  ADMIN: new Role(BUILTIN_IDS.ADMIN, "Admin")
    .addPermission(BUILTIN_PERMISSION_IDS.ADMIN)
    .addInheritance(BUILTIN_IDS.POWER),
  POWER: new Role(BUILTIN_IDS.POWER, "Power")
    .addPermission(BUILTIN_PERMISSION_IDS.POWER)
    .addInheritance(BUILTIN_IDS.BASIC),
  BASIC: new Role(BUILTIN_IDS.BASIC, "Basic")
    .addPermission(BUILTIN_PERMISSION_IDS.WRITE)
    .addInheritance(BUILTIN_IDS.PUBLIC),
  PUBLIC: new Role(BUILTIN_IDS.PUBLIC, "Public").addPermission(
    BUILTIN_PERMISSION_IDS.READ_ONLY
  ),
  BUILDER: new Role(BUILTIN_IDS.BUILDER, "Builder").addPermission(
    BUILTIN_PERMISSION_IDS.ADMIN
  ),
}

exports.BUILTIN_ROLE_ID_ARRAY = Object.values(exports.BUILTIN_ROLES).map(
  role => role._id
)

exports.BUILTIN_ROLE_NAME_ARRAY = Object.values(exports.BUILTIN_ROLES).map(
  role => role.name
)

function isBuiltin(role) {
  return exports.BUILTIN_ROLE_ID_ARRAY.some(builtin => role.includes(builtin))
}

/**
 * Gets the role object, this is mainly useful for two purposes, to check if the level exists and
 * to check if the role inherits any others.
 * @param {string} appId The app in which to look for the role.
 * @param {string|null} roleId The level ID to lookup.
 * @returns {Promise<Role|object|null>} The role object, which may contain an "inherits" property.
 */
exports.getRole = async (appId, roleId) => {
  if (!roleId) {
    return null
  }
  let role = {}
  // built in roles mostly come from the in-code implementation,
  // but can be extended by a doc stored about them (e.g. permissions)
  if (isBuiltin(roleId)) {
    role = cloneDeep(
      Object.values(exports.BUILTIN_ROLES).find(role => role._id === roleId)
    )
  }
  try {
    const db = new CouchDB(appId)
    const dbRole = await db.get(exports.getDBRoleID(roleId))
    role = Object.assign(role, dbRole)
    // finalise the ID
    role._id = exports.getExternalRoleID(role._id)
  } catch (err) {
    // only throw an error if there is no role at all
    if (Object.keys(role).length === 0) {
      throw err
    }
  }
  return role
}

/**
 * Simple function to get all the roles based on the top level user role ID.
 */
async function getAllUserRoles(appId, userRoleId) {
  if (!userRoleId) {
    return [BUILTIN_IDS.PUBLIC]
  }
  let currentRole = await exports.getRole(appId, userRoleId)
  let roles = currentRole ? [currentRole] : []
  let roleIds = [userRoleId]
  // get all the inherited roles
  while (
    currentRole &&
    currentRole.inherits &&
    roleIds.indexOf(currentRole.inherits) === -1
  ) {
    roleIds.push(currentRole.inherits)
    currentRole = await exports.getRole(appId, currentRole.inherits)
    roles.push(currentRole)
  }
  return roles
}

/**
 * Returns an ordered array of the user's inherited role IDs, this can be used
 * to determine if a user can access something that requires a specific role.
 * @param {string} appId The ID of the application from which roles should be obtained.
 * @param {string} userRoleId The user's role ID, this can be found in their access token.
 * @returns {Promise<string[]>} returns an ordered array of the roles, with the first being their
 * highest level of access and the last being the lowest level.
 */
exports.getUserRoleHierarchy = async (appId, userRoleId) => {
  // special case, if they don't have a role then they are a public user
  return (await getAllUserRoles(appId, userRoleId)).map(role => role._id)
}

/**
 * Get all of the user permissions which could be found across the role hierarchy
 * @param appId The ID of the application from which roles should be obtained.
 * @param userRoleId The user's role ID, this can be found in their access token.
 * @returns {Promise<{basePermissions: string[], permissions: Object}>} the base
 * permission IDs as well as any custom resource permissions.
 */
exports.getUserPermissions = async (appId, userRoleId) => {
  const rolesHierarchy = await getAllUserRoles(appId, userRoleId)
  const basePermissions = [
    ...new Set(rolesHierarchy.map(role => role.permissionId)),
  ]
  const permissions = {}
  for (let role of rolesHierarchy) {
    if (role.permissions) {
      for (let [resource, level] of Object.entries(role.permissions)) {
        permissions[resource] = higherPermission(permissions[resource], level)
      }
    }
  }
  return {
    basePermissions,
    permissions,
  }
}

class AccessController {
  constructor(appId) {
    this.appId = appId
    this.userHierarchies = {}
  }

  async hasAccess(tryingRoleId, userRoleId) {
    // special cases, the screen has no role, the roles are the same or the user
    // is currently in the builder
    if (
      tryingRoleId == null ||
      tryingRoleId === "" ||
      tryingRoleId === userRoleId ||
      tryingRoleId === BUILTIN_IDS.BUILDER
    ) {
      return true
    }
    let roleIds = this.userHierarchies[userRoleId]
    if (!roleIds) {
      roleIds = await exports.getUserRoleHierarchy(this.appId, userRoleId)
      this.userHierarchies[userRoleId] = roleIds
    }

    return roleIds.indexOf(tryingRoleId) !== -1
  }

  async checkScreensAccess(screens, userRoleId) {
    let accessibleScreens = []
    // don't want to handle this with Promise.all as this would mean all custom roles would be
    // retrieved at same time, it is likely a custom role will be re-used and therefore want
    // to work in sync for performance save
    for (let screen of screens) {
      const accessible = await this.checkScreenAccess(screen, userRoleId)
      if (accessible) {
        accessibleScreens.push(accessible)
      }
    }
    return accessibleScreens
  }

  async checkScreenAccess(screen, userRoleId) {
    const roleId = screen && screen.routing ? screen.routing.roleId : null
    if (await this.hasAccess(roleId, userRoleId)) {
      return screen
    }
    return null
  }
}

/**
 * Adds the "role_" for builtin role IDs which are to be written to the DB (for permissions).
 */
exports.getDBRoleID = roleId => {
  if (roleId.startsWith(DocumentTypes.ROLE)) {
    return roleId
  }
  return generateRoleID(roleId)
}

/**
 * Remove the "role_" from builtin role IDs that have been written to the DB (for permissions).
 */
exports.getExternalRoleID = roleId => {
  // for built in roles we want to remove the DB role ID element (role_)
  if (roleId.startsWith(DocumentTypes.ROLE) && isBuiltin(roleId)) {
    return roleId.split(`${DocumentTypes.ROLE}${SEPARATOR}`)[1]
  }
  return roleId
}

exports.AccessController = AccessController
exports.BUILTIN_ROLE_IDS = BUILTIN_IDS
exports.isBuiltin = isBuiltin
exports.Role = Role

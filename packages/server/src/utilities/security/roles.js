const CouchDB = require("../../db")
const { cloneDeep } = require("lodash/fp")

const BUILTIN_IDS = {
  ADMIN: "ADMIN",
  POWER: "POWER_USER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
  BUILDER: "BUILDER",
}

function Role(id, name, inherits) {
  this._id = id
  this.name = name
  if (inherits) {
    this.inherits = inherits
  }
}

exports.BUILTIN_ROLES = {
  ADMIN: new Role(BUILTIN_IDS.ADMIN, "Admin", BUILTIN_IDS.POWER),
  POWER: new Role(BUILTIN_IDS.POWER, "Power", BUILTIN_IDS.BASIC),
  BASIC: new Role(BUILTIN_IDS.BASIC, "Basic", BUILTIN_IDS.PUBLIC),
  PUBLIC: new Role(BUILTIN_IDS.PUBLIC, "Public"),
  BUILDER: new Role(BUILTIN_IDS.BUILDER, "Builder"),
}

exports.BUILTIN_ROLE_ID_ARRAY = Object.values(exports.BUILTIN_ROLES).map(
  level => level._id
)

exports.BUILTIN_ROLE_NAME_ARRAY = Object.values(exports.BUILTIN_ROLES).map(
  level => level.name
)

function isBuiltin(role) {
  return exports.BUILTIN_ROLE_ID_ARRAY.indexOf(role) !== -1
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
  let role
  if (isBuiltin(roleId)) {
    role = cloneDeep(
      Object.values(exports.BUILTIN_ROLES).find(role => role._id === roleId)
    )
  } else {
    const db = new CouchDB(appId)
    role = await db.get(roleId)
  }
  return role
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
  if (!userRoleId) {
    return [BUILTIN_IDS.PUBLIC]
  }
  let roleIds = [userRoleId]
  let userRole = await exports.getRole(appId, userRoleId)
  // check if inherited makes it possible
  while (
    userRole &&
    userRole.inherits &&
    roleIds.indexOf(userRole.inherits) === -1
  ) {
    roleIds.push(userRole.inherits)
    // go to get the inherited incase it inherits anything
    userRole = await exports.getRole(appId, userRole.inherits)
  }
  return roleIds
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

exports.AccessController = AccessController
exports.BUILTIN_ROLE_IDS = BUILTIN_IDS
exports.isBuiltin = isBuiltin
exports.Role = Role

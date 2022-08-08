const { cloneDeep } = require("lodash/fp")
const { BUILTIN_PERMISSION_IDS, PermissionLevels } = require("./permissions")
const {
  generateRoleID,
  getRoleParams,
  DocumentTypes,
  SEPARATOR,
} = require("../db/utils")
const { getAppDB } = require("../context")
const { doWithDB } = require("../db")

const BUILTIN_IDS = {
  ADMIN: "ADMIN",
  POWER: "POWER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
}

// exclude internal roles like builder
const EXTERNAL_BUILTIN_ROLE_IDS = [
  BUILTIN_IDS.ADMIN,
  BUILTIN_IDS.POWER,
  BUILTIN_IDS.BASIC,
  BUILTIN_IDS.PUBLIC,
]

function Role(id, name) {
  this._id = id
  this.name = name
}

Role.prototype.addPermission = function (permissionId) {
  this.permissionId = permissionId
  return this
}

Role.prototype.addInheritance = function (inherits) {
  this.inherits = inherits
  return this
}

const BUILTIN_ROLES = {
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
    BUILTIN_PERMISSION_IDS.PUBLIC
  ),
  BUILDER: new Role(BUILTIN_IDS.BUILDER, "Builder").addPermission(
    BUILTIN_PERMISSION_IDS.ADMIN
  ),
}

exports.getBuiltinRoles = () => {
  return cloneDeep(BUILTIN_ROLES)
}

exports.BUILTIN_ROLE_ID_ARRAY = Object.values(BUILTIN_ROLES).map(
  role => role._id
)

exports.BUILTIN_ROLE_NAME_ARRAY = Object.values(BUILTIN_ROLES).map(
  role => role.name
)

function isBuiltin(role) {
  return exports.BUILTIN_ROLE_ID_ARRAY.some(builtin => role.includes(builtin))
}

/**
 * Works through the inheritance ranks to see how far up the builtin stack this ID is.
 */
exports.builtinRoleToNumber = id => {
  const builtins = exports.getBuiltinRoles()
  const MAX = Object.values(BUILTIN_IDS).length + 1
  if (id === BUILTIN_IDS.ADMIN || id === BUILTIN_IDS.BUILDER) {
    return MAX
  }
  let role = builtins[id],
    count = 0
  do {
    if (!role) {
      break
    }
    role = builtins[role.inherits]
    count++
  } while (role !== null)
  return count
}

/**
 * Returns whichever builtin roleID is lower.
 */
exports.lowerBuiltinRoleID = (roleId1, roleId2) => {
  if (!roleId1) {
    return roleId2
  }
  if (!roleId2) {
    return roleId1
  }
  return exports.builtinRoleToNumber(roleId1) >
    exports.builtinRoleToNumber(roleId2)
    ? roleId2
    : roleId1
}

/**
 * Gets the role object, this is mainly useful for two purposes, to check if the level exists and
 * to check if the role inherits any others.
 * @param {string|null} roleId The level ID to lookup.
 * @returns {Promise<Role|object|null>} The role object, which may contain an "inherits" property.
 */
exports.getRole = async roleId => {
  if (!roleId) {
    return null
  }
  let role = {}
  // built in roles mostly come from the in-code implementation,
  // but can be extended by a doc stored about them (e.g. permissions)
  if (isBuiltin(roleId)) {
    role = cloneDeep(
      Object.values(BUILTIN_ROLES).find(role => role._id === roleId)
    )
  }
  try {
    const db = getAppDB()
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
async function getAllUserRoles(userRoleId) {
  // admins have access to all roles
  if (userRoleId === BUILTIN_IDS.ADMIN) {
    return exports.getAllRoles()
  }
  let currentRole = await exports.getRole(userRoleId)
  let roles = currentRole ? [currentRole] : []
  let roleIds = [userRoleId]
  // get all the inherited roles
  while (
    currentRole &&
    currentRole.inherits &&
    roleIds.indexOf(currentRole.inherits) === -1
  ) {
    roleIds.push(currentRole.inherits)
    currentRole = await exports.getRole(currentRole.inherits)
    roles.push(currentRole)
  }
  return roles
}

/**
 * Returns an ordered array of the user's inherited role IDs, this can be used
 * to determine if a user can access something that requires a specific role.
 * @param {string} userRoleId The user's role ID, this can be found in their access token.
 * @param {object} opts Various options, such as whether to only retrieve the IDs (default true).
 * @returns {Promise<string[]>} returns an ordered array of the roles, with the first being their
 * highest level of access and the last being the lowest level.
 */
exports.getUserRoleHierarchy = async (userRoleId, opts = { idOnly: true }) => {
  // special case, if they don't have a role then they are a public user
  const roles = await getAllUserRoles(userRoleId)
  return opts.idOnly ? roles.map(role => role._id) : roles
}

// this function checks that the provided permissions are in an array format
// some templates/older apps will use a simple string instead of array for roles
// convert the string to an array using the theory that write is higher than read
exports.checkForRoleResourceArray = (rolePerms, resourceId) => {
  if (rolePerms && !Array.isArray(rolePerms[resourceId])) {
    const permLevel = rolePerms[resourceId]
    rolePerms[resourceId] = [permLevel]
    if (permLevel === PermissionLevels.WRITE) {
      rolePerms[resourceId].push(PermissionLevels.READ)
    }
  }
  return rolePerms
}

/**
 * Given an app ID this will retrieve all of the roles that are currently within that app.
 * @return {Promise<object[]>} An array of the role objects that were found.
 */
exports.getAllRoles = async appId => {
  if (appId) {
    return doWithDB(appId, internal)
  } else {
    let appDB
    try {
      appDB = getAppDB()
    } catch (error) {
      // We don't have any apps, so we'll just use the built-in roles
    }
    return internal(appDB)
  }
  async function internal(db) {
    let roles = []
    if (db) {
      const body = await db.allDocs(
        getRoleParams(null, {
          include_docs: true,
        })
      )
      roles = body.rows.map(row => row.doc)
    }
    const builtinRoles = exports.getBuiltinRoles()

    // need to combine builtin with any DB record of them (for sake of permissions)
    for (let builtinRoleId of EXTERNAL_BUILTIN_ROLE_IDS) {
      const builtinRole = builtinRoles[builtinRoleId]
      const dbBuiltin = roles.filter(
        dbRole => exports.getExternalRoleID(dbRole._id) === builtinRoleId
      )[0]
      if (dbBuiltin == null) {
        roles.push(builtinRole || builtinRoles.BASIC)
      } else {
        // remove role and all back after combining with the builtin
        roles = roles.filter(role => role._id !== dbBuiltin._id)
        dbBuiltin._id = exports.getExternalRoleID(dbBuiltin._id)
        roles.push(Object.assign(builtinRole, dbBuiltin))
      }
    }
    // check permissions
    for (let role of roles) {
      if (!role.permissions) {
        continue
      }
      for (let resourceId of Object.keys(role.permissions)) {
        role.permissions = exports.checkForRoleResourceArray(
          role.permissions,
          resourceId
        )
      }
    }
    return roles
  }
}

/**
 * This retrieves the required role for a resource
 * @param permLevel The level of request
 * @param resourceId The resource being requested
 * @param subResourceId The sub resource being requested
 * @return {Promise<{permissions}|Object>} returns the permissions required to access.
 */
exports.getRequiredResourceRole = async (
  permLevel,
  { resourceId, subResourceId }
) => {
  const roles = await exports.getAllRoles()
  let main = [],
    sub = []
  for (let role of roles) {
    // no permissions, ignore it
    if (!role.permissions) {
      continue
    }
    const mainRes = role.permissions[resourceId]
    const subRes = role.permissions[subResourceId]
    if (mainRes && mainRes.indexOf(permLevel) !== -1) {
      main.push(role._id)
    } else if (subRes && subRes.indexOf(permLevel) !== -1) {
      sub.push(role._id)
    }
  }
  // for now just return the IDs
  return main.concat(sub)
}

class AccessController {
  constructor() {
    this.userHierarchies = {}
  }

  async hasAccess(tryingRoleId, userRoleId) {
    // special cases, the screen has no role, the roles are the same or the user
    // is currently in the builder
    if (
      tryingRoleId == null ||
      tryingRoleId === "" ||
      tryingRoleId === userRoleId ||
      tryingRoleId === BUILTIN_IDS.BUILDER ||
      userRoleId === BUILTIN_IDS.BUILDER
    ) {
      return true
    }
    let roleIds = this.userHierarchies[userRoleId]
    if (!roleIds) {
      roleIds = await exports.getUserRoleHierarchy(userRoleId)
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

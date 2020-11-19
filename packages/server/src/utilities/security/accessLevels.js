const CouchDB = require("../../db")
const { cloneDeep } = require("lodash/fp")

const BUILTIN_IDS = {
  ADMIN: "ADMIN",
  POWER: "POWER_USER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
  BUILDER: "BUILDER",
}

function AccessLevel(id, name, inherits) {
  this._id = id
  this.name = name
  if (inherits) {
    this.inherits = inherits
  }
}

exports.BUILTIN_LEVELS = {
  ADMIN: new AccessLevel(BUILTIN_IDS.ADMIN, "Admin", BUILTIN_IDS.POWER),
  POWER: new AccessLevel(BUILTIN_IDS.POWER, "Power", BUILTIN_IDS.BASIC),
  BASIC: new AccessLevel(BUILTIN_IDS.BASIC, "Basic", BUILTIN_IDS.PUBLIC),
  ANON: new AccessLevel(BUILTIN_IDS.PUBLIC, "Public"),
  BUILDER: new AccessLevel(BUILTIN_IDS.BUILDER, "Builder"),
}

exports.BUILTIN_LEVEL_ID_ARRAY = Object.values(exports.BUILTIN_LEVELS).map(
  level => level._id
)

exports.BUILTIN_LEVEL_NAME_ARRAY = Object.values(exports.BUILTIN_LEVELS).map(
  level => level.name
)

function isBuiltin(accessLevel) {
  return exports.BUILTIN_LEVEL_ID_ARRAY.indexOf(accessLevel) !== -1
}

/**
 * Gets the access level object, this is mainly useful for two purposes, to check if the level exists and
 * to check if the access level inherits any others.
 * @param {string} appId The app in which to look for the access level.
 * @param {string|null} accessLevelId The level ID to lookup.
 * @returns {Promise<AccessLevel|object|null>} The access level object, which may contain an "inherits" property.
 */
exports.getAccessLevel = async (appId, accessLevelId) => {
  if (!accessLevelId) {
    return null
  }
  let accessLevel
  if (isBuiltin(accessLevelId)) {
    accessLevel = cloneDeep(
      Object.values(exports.BUILTIN_LEVELS).find(
        level => level._id === accessLevelId
      )
    )
  } else {
    const db = new CouchDB(appId)
    accessLevel = await db.get(accessLevelId)
  }
  return accessLevel
}

/**
 * Returns an ordered array of the user's inherited access level IDs, this can be used
 * to determine if a user can access something that requires a specific access level.
 * @param {string} appId The ID of the application from which access levels should be obtained.
 * @param {string} userAccessLevelId The user's access level, this can be found in their access token.
 * @returns {Promise<string[]>} returns an ordered array of the access levels, with the first being their
 * highest level of access and the last being the lowest level.
 */
exports.getUserAccessLevelHierarchy = async (appId, userAccessLevelId) => {
  // special case, if they don't have a level then they are a public user
  if (!userAccessLevelId) {
    return [BUILTIN_IDS.PUBLIC]
  }
  let accessLevelIds = [userAccessLevelId]
  let userAccess = await exports.getAccessLevel(appId, userAccessLevelId)
  // check if inherited makes it possible
  while (
    userAccess &&
    userAccess.inherits &&
    accessLevelIds.indexOf(userAccess.inherits) === -1
  ) {
    accessLevelIds.push(userAccess.inherits)
    // go to get the inherited incase it inherits anything
    userAccess = await exports.getAccessLevel(appId, userAccess.inherits)
  }
  // add the user's actual level at the end (not at start as that stops iteration
  return accessLevelIds
}

class AccessController {
  constructor(appId) {
    this.appId = appId
    this.userHierarchies = {}
  }

  async hasAccess(tryingAccessLevelId, userAccessLevelId) {
    // special cases, the screen has no access level, the access levels are the same or the user
    // is currently in the builder
    if (
      tryingAccessLevelId == null ||
      tryingAccessLevelId === "" ||
      tryingAccessLevelId === userAccessLevelId ||
      userAccessLevelId === BUILTIN_IDS.BUILDER
    ) {
      return true
    }
    let accessLevelIds = this.userHierarchies[userAccessLevelId]
    if (!accessLevelIds) {
      accessLevelIds = await exports.getUserAccessLevelHierarchy(
        this.appId,
        userAccessLevelId
      )
      this.userHierarchies[userAccessLevelId] = userAccessLevelId
    }

    return accessLevelIds.indexOf(tryingAccessLevelId) !== -1
  }

  async checkScreensAccess(screens, userAccessLevelId) {
    let accessibleScreens = []
    // don't want to handle this with Promise.all as this would mean all custom access levels would be
    // retrieved at same time, it is likely a custom levels will be re-used and therefore want
    // to work in sync for performance save
    for (let screen of screens) {
      const accessible = await this.checkScreenAccess(screen, userAccessLevelId)
      if (accessible) {
        accessibleScreens.push(accessible)
      }
    }
    return accessibleScreens
  }

  async checkScreenAccess(screen, userAccessLevelId) {
    const accessLevelId =
      screen && screen.routing ? screen.routing.accessLevelId : null
    if (await this.hasAccess(accessLevelId, userAccessLevelId)) {
      return screen
    }
    return null
  }
}

exports.AccessController = AccessController
exports.BUILTIN_LEVEL_IDS = BUILTIN_IDS
exports.isBuiltin = isBuiltin
exports.AccessLevel = AccessLevel

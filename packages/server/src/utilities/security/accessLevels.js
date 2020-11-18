const CouchDB = require("../../db")

const BUILTIN_IDS = {
  ADMIN: "ADMIN",
  POWER: "POWER_USER",
  BASIC: "BASIC",
  ANON: "ANON",
  BUILDER: "BUILDER",
}

function AccessLevel(id, name, inherits = null) {
  this._id = id
  this.name = name
  if (inherits) {
    this.inherits = inherits
  }
}

exports.BUILTIN_LEVELS = {
  ADMIN: new AccessLevel(BUILTIN_IDS.ADMIN, "Admin", BUILTIN_IDS.POWER),
  POWER: new AccessLevel(BUILTIN_IDS.POWER, "Power", BUILTIN_IDS.BASIC),
  BASIC: new AccessLevel(BUILTIN_IDS.BASIC, "Basic", BUILTIN_IDS.ANON),
  ANON: new AccessLevel(BUILTIN_IDS.ANON, "Anonymous"),
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

class AccessController {
  constructor(appId) {
    this.appId = appId
    this.accessLevels = {}
  }

  async getAccessLevel(accessLevelId) {
    if (this.accessLevels[accessLevelId]) {
      return this.accessLevels[accessLevelId]
    }
    let accessLevel
    if (isBuiltin(accessLevelId)) {
      accessLevel = Object.values(exports.BUILTIN_LEVELS).find(
        level => level._id === accessLevelId
      )
    } else {
      const db = new CouchDB(this.appId)
      accessLevel = await db.get(accessLevelId)
    }
    this.accessLevels[accessLevelId] = accessLevel
    return accessLevel
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
    let userAccess = await this.getAccessLevel(userAccessLevelId)
    // check if inherited makes it possible
    while (userAccess.inherits) {
      if (tryingAccessLevelId === userAccess.inherits) {
        return true
      }
      // go to get the inherited incase it inherits anything
      userAccess = await this.getAccessLevel(userAccess.inherits)
    }
    return false
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

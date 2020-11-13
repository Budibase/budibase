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
  POWER: new AccessLevel(BUILTIN_IDS.POWER, "Admin", BUILTIN_IDS.BASIC),
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
  return BUILTIN_IDS.indexOf(accessLevel) !== -1
}

exports.getAccessLevel = async (appId, accessLevelId) => {
  if (isBuiltin(accessLevelId)) {
    return Object.values(exports.BUILTIN_LEVELS).find(
      level => level._id === accessLevelId
    )
  }
  const db = new CouchDB(appId)
  return await db.get(accessLevelId)
}

exports.hasAccess = async (appId, tryingAccessLevelId, userAccessLevelId) => {
  // special first case, if they are equal then access is allowed, no need to try anything
  if (tryingAccessLevelId === userAccessLevelId) {
    return true
  }
  let userAccess = await exports.getAccessLevel(appId, userAccessLevelId)
  // check if inherited makes it possible
  while (userAccess.inherits) {
    if (tryingAccessLevelId === userAccess.inherits) {
      return true
    }
    // go to get the inherited incase it inherits anything
    userAccess = await exports.getAccessLevel(appId, userAccess.inherits)
  }
  return false
}

exports.BUILTIN_LEVEL_IDS = BUILTIN_IDS
exports.isBuiltin = isBuiltin
exports.AccessLevel = AccessLevel

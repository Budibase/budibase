const CouchDB = require("../db")
const {
  getMultiIDParams,
  getGlobalIDFromUserMetadataID,
  StaticDatabases,
} = require("../db/utils")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
const { getDeployedAppID } = require("@budibase/auth/db")
const { getGlobalUserParams } = require("@budibase/auth/db")
const { user: userCache } = require("@budibase/auth/cache")

exports.updateAppRole = (appId, user) => {
  if (!user.roles) {
    return user
  }

  // always use the deployed app
  user.roleId = user.roles[getDeployedAppID(appId)]
  // if a role wasn't found then either set as admin (builder) or public (everyone else)
  if (!user.roleId && user.builder && user.builder.global) {
    user.roleId = BUILTIN_ROLE_IDS.ADMIN
  } else if (!user.roleId) {
    user.roleId = BUILTIN_ROLE_IDS.BASIC
  }
  delete user.roles
  return user
}

function processUser(appId, user) {
  if (user) {
    delete user.password
  }
  return exports.updateAppRole(appId, user)
}

exports.getCachedSelf = async (ctx, appId) => {
  const user = await userCache.getUser(ctx.user._id)
  return processUser(appId, user)
}

exports.getGlobalUser = async (appId, userId) => {
  const db = CouchDB(StaticDatabases.GLOBAL.name)
  let user = await db.get(getGlobalIDFromUserMetadataID(userId))
  return processUser(appId, user)
}

exports.getGlobalUsers = async (appId = null, users = null) => {
  const db = CouchDB(StaticDatabases.GLOBAL.name)
  let globalUsers
  if (users) {
    const globalIds = users.map(user => getGlobalIDFromUserMetadataID(user._id))
    globalUsers = (await db.allDocs(getMultiIDParams(globalIds))).rows.map(
      row => row.doc
    )
  } else {
    globalUsers = (
      await db.allDocs(
        getGlobalUserParams(null, {
          include_docs: true,
        })
      )
    ).rows.map(row => row.doc)
  }
  globalUsers = globalUsers
    .filter(user => user != null)
    .map(user => {
      delete user.password
      return user
    })
  if (!appId) {
    return globalUsers
  }
  return globalUsers.map(user => exports.updateAppRole(appId, user))
}

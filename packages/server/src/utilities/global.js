const {
  getMultiIDParams,
  getGlobalIDFromUserMetadataID,
} = require("../db/utils")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
const { getDeployedAppID } = require("@budibase/auth/db")
const { getGlobalUserParams } = require("@budibase/auth/db")
const { user: userCache } = require("@budibase/auth/cache")
const { getGlobalDB, isUserInAppTenant } = require("@budibase/auth/tenancy")
const env = require("../environment")

exports.updateAppRole = (appId, user) => {
  if (!user || !user.roles) {
    return user
  }
  // if in an multi-tenancy environment make sure roles are never updated
  if (env.MULTI_TENANCY && !isUserInAppTenant(appId, user)) {
    delete user.builder
    delete user.admin
    user.roleId = BUILTIN_ROLE_IDS.PUBLIC
    return user
  }
  // always use the deployed app
  user.roleId = user.roles[getDeployedAppID(appId)]
  // if a role wasn't found then either set as admin (builder) or public (everyone else)
  if (!user.roleId && user.builder && user.builder.global) {
    user.roleId = BUILTIN_ROLE_IDS.ADMIN
  } else if (!user.roleId) {
    user.roleId = BUILTIN_ROLE_IDS.PUBLIC
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
  // this has to be tenant aware, can't depend on the context to find it out
  // running some middlewares before the tenancy causes context to break
  const user = await userCache.getUser(ctx.user._id)
  return processUser(appId, user)
}

exports.getRawGlobalUser = async userId => {
  const db = getGlobalDB()
  return db.get(getGlobalIDFromUserMetadataID(userId))
}

exports.getGlobalUser = async (appId, userId) => {
  let user = await exports.getRawGlobalUser(userId)
  return processUser(appId, user)
}

exports.getGlobalUsers = async (appId = null, users = null) => {
  const db = getGlobalDB()
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
      delete user.forceResetPassword
      return user
    })
  if (!appId) {
    return globalUsers
  }
  return globalUsers.map(user => exports.updateAppRole(appId, user))
}

exports.getGlobalUsersFromMetadata = async (appId, users) => {
  const globalUsers = await exports.getGlobalUsers(appId, users)
  return users.map(user => {
    const globalUser = globalUsers.find(
      globalUser => globalUser && user._id.includes(globalUser._id)
    )
    return {
      ...globalUser,
      // doing user second overwrites the id and rev (always metadata)
      ...user,
    }
  })
}

const { InternalTables } = require("../db/utils")
const { getGlobalUser } = require("../utilities/global")
const { getAppDB } = require("@budibase/backend-core/context")
const { getProdAppID } = require("@budibase/backend-core/db")
const { BUILTIN_ROLE_IDS } = require("@budibase/backend-core/roles")

exports.getFullUser = async (ctx, userId) => {
  const global = await getGlobalUser(userId)
  let metadata = {}
  try {
    // this will throw an error if the db doesn't exist, or there is no appId
    const db = getAppDB()
    metadata = await db.get(userId)
  } catch (err) {
    // it is fine if there is no user metadata, just remove global db info
    delete global._id
    delete global._rev
  }
  delete metadata.csrfToken
  return {
    ...metadata,
    ...global,
    roleId: global.roleId || BUILTIN_ROLE_IDS.PUBLIC,
    tableId: InternalTables.USER_METADATA,
    // make sure the ID is always a local ID, not a global one
    _id: userId,
  }
}

exports.publicApiUserFix = ctx => {
  if (!ctx.request.body) {
    return ctx
  }
  if (!ctx.request.body._id && ctx.params.userId) {
    ctx.request.body._id = ctx.params.userId
  }
  if (!ctx.request.body.roles) {
    ctx.request.body.roles = {}
  } else {
    const newRoles = {}
    for (let [appId, role] of Object.entries(ctx.request.body.roles)) {
      // @ts-ignore
      newRoles[getProdAppID(appId)] = role
    }
    ctx.request.body.roles = newRoles
  }
  return ctx
}

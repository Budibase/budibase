const { outputProcessing } = require("../../utilities/rowProcessor")
const { InternalTables } = require("../../db/utils")
const { getFullUser } = require("../../utilities/users")
const { BUILTIN_ROLE_IDS } = require("@budibase/backend-core/roles")
const { getAppDB, getAppId } = require("@budibase/backend-core/context")

/**
 * Add the attributes that are session based to the current user.
 */
const addSessionAttributesToUser = ctx => {
  if (ctx.user) {
    ctx.body.license = ctx.user.license
  }
}

exports.fetchSelf = async ctx => {
  let userId = ctx.user.userId || ctx.user._id
  /* istanbul ignore next */
  if (!userId || !ctx.isAuthenticated) {
    ctx.body = {}
    return
  }

  const user = await getFullUser(ctx, userId)
  // this shouldn't be returned by the app self
  delete user.roles
  // forward the csrf token from the session
  user.csrfToken = ctx.user.csrfToken

  if (getAppId()) {
    const db = getAppDB()
    // remove the full roles structure
    delete user.roles
    try {
      const userTable = await db.get(InternalTables.USER_METADATA)
      const metadata = await db.get(userId)
      // make sure there is never a stale csrf token
      delete metadata.csrfToken
      // specifically needs to make sure is enriched
      ctx.body = await outputProcessing(userTable, {
        ...user,
        ...metadata,
      })
    } catch (err) {
      let response
      // user didn't exist in app, don't pretend they do
      if (user.roleId === BUILTIN_ROLE_IDS.PUBLIC) {
        response = {}
      }
      // user has a role of some sort, return them
      else if (err.status === 404) {
        const metadata = {
          ...user,
          _id: userId,
        }
        const dbResp = await db.put(metadata)
        user._rev = dbResp.rev
        response = user
      } else {
        response = user
      }
      ctx.body = response
    }
  } else {
    ctx.body = user
  }

  addSessionAttributesToUser(ctx)
}

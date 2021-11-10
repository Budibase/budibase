const CouchDB = require("../../db")
const { outputProcessing } = require("../../utilities/rowProcessor")
const { InternalTables } = require("../../db/utils")
const { getFullUser } = require("../../utilities/users")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")

exports.fetchSelf = async ctx => {
  const appId = ctx.appId
  let userId = ctx.user.userId || ctx.user._id
  /* istanbul ignore next */
  if (!userId) {
    ctx.body = {}
    return
  }

  const user = await getFullUser(ctx, userId)
  // this shouldn't be returned by the app self
  delete user.roles

  if (appId) {
    const db = new CouchDB(appId)
    // remove the full roles structure
    delete user.roles
    try {
      const userTable = await db.get(InternalTables.USER_METADATA)
      const metadata = await db.get(userId)
      // specifically needs to make sure is enriched
      ctx.body = await outputProcessing(ctx, userTable, {
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
}

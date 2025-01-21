import { outputProcessing } from "../../utilities/rowProcessor"
import { InternalTables } from "../../db/utils"
import { getFullUser } from "../../utilities/users"
import { roles, context, db as dbCore } from "@budibase/backend-core"
import { AppSelfResponse, ContextUser, UserCtx } from "@budibase/types"
import sdk from "../../sdk"
import { processUser } from "../../utilities/global"

const PUBLIC_ROLE = roles.BUILTIN_ROLE_IDS.PUBLIC

/**
 * Add the attributes that are session based to the current user.
 */
const addSessionAttributesToUser = (ctx: any) => {
  if (ctx.user) {
    ctx.body.license = ctx.user.license
  }
}

export async function fetchSelf(ctx: UserCtx<void, AppSelfResponse>) {
  let userId = ctx.user.userId || ctx.user._id
  /* istanbul ignore next */
  if (!userId || !ctx.isAuthenticated) {
    ctx.body = {}
    return
  }

  const appId = context.getAppId()
  let user: ContextUser = await getFullUser(userId)
  // add globalId of user
  user.globalId = dbCore.getGlobalIDFromUserMetadataID(userId)
  // this shouldn't be returned by the app self
  delete user.roles
  // forward the csrf token from the session
  user.csrfToken = ctx.user.csrfToken

  if (appId) {
    const db = context.getAppDB()
    // check for group permissions
    if (!user.roleId || user.roleId === PUBLIC_ROLE) {
      user = await processUser(user, { appId })
    }
    // remove the full roles structure
    delete user.roles
    try {
      const userTable = await sdk.tables.getTable(InternalTables.USER_METADATA)
      // specifically needs to make sure is enriched
      ctx.body = await outputProcessing(userTable, user)
    } catch (err: any) {
      let response: ContextUser | {}
      // user didn't exist in app, don't pretend they do
      if (user.roleId === PUBLIC_ROLE) {
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

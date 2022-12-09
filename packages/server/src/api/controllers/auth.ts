import { outputProcessing } from "../../utilities/rowProcessor"
import { InternalTables } from "../../db/utils"
import { getFullUser } from "../../utilities/users"
import { roles, context } from "@budibase/backend-core"
import { groups } from "@budibase/pro"
import { ContextUser, User, Row } from "@budibase/types"

const PUBLIC_ROLE = roles.BUILTIN_ROLE_IDS.PUBLIC

/**
 * Add the attributes that are session based to the current user.
 */
const addSessionAttributesToUser = (ctx: any) => {
  if (ctx.user) {
    ctx.body.license = ctx.user.license
  }
}

export async function fetchSelf(ctx: any) {
  let userId = ctx.user.userId || ctx.user._id
  /* istanbul ignore next */
  if (!userId || !ctx.isAuthenticated) {
    ctx.body = {}
    return
  }

  const appId = context.getAppId()
  const user: ContextUser = await getFullUser(ctx, userId)
  // this shouldn't be returned by the app self
  delete user.roles
  // forward the csrf token from the session
  user.csrfToken = ctx.user.csrfToken

  if (appId) {
    const db = context.getAppDB()
    // check for group permissions
    if (!user.roleId || user.roleId === PUBLIC_ROLE) {
      const groupRoleId = await groups.getGroupRoleId(user as User, appId)
      user.roleId = groupRoleId || user.roleId
    }
    // remove the full roles structure
    delete user.roles
    try {
      const userTable = await db.get(InternalTables.USER_METADATA)
      // specifically needs to make sure is enriched
      ctx.body = await outputProcessing(userTable, user as Row)
    } catch (err: any) {
      let response
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

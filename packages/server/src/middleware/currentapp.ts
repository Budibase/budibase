import {
  utils,
  constants,
  roles,
  tenancy,
  context,
  users,
} from "@budibase/backend-core"
import { generateUserMetadataID, isDevAppID } from "../db/utils"
import { getCachedSelf } from "../utilities/global"
import env from "../environment"
import { isWebhookEndpoint } from "./utils"
import { UserCtx, ContextUser } from "@budibase/types"

export default async (ctx: UserCtx, next: any) => {
  // try to get the appID from the request
  let requestAppId = await utils.getAppIdFromCtx(ctx)
  if (!requestAppId) {
    return next()
  }

  // deny access to application preview
  if (!env.isTest()) {
    if (
      isDevAppID(requestAppId) &&
      !isWebhookEndpoint(ctx) &&
      !users.isBuilder(ctx.user, requestAppId)
    ) {
      return ctx.redirect("/")
    }
  }

  let appId: string | undefined,
    roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  if (!ctx.user?._id) {
    // not logged in, try to set a cookie for public apps
    appId = requestAppId
  } else if (requestAppId != null) {
    // Different App ID means cookie needs reset, or if the same public user has logged in
    const globalUser = await getCachedSelf(ctx, requestAppId)
    appId = requestAppId
    // retrieving global user gets the right role
    roleId = globalUser.roleId || roleId

    // Allow builders to specify their role via a header
    const isBuilder = users.isBuilder(globalUser, appId)
    const isDevApp = appId && isDevAppID(appId)
    const roleHeader =
      ctx.request &&
      (ctx.request.headers[constants.Header.PREVIEW_ROLE] as string)
    if (isBuilder && isDevApp && roleHeader) {
      // Ensure the role is valid by ensuring a definition exists
      try {
        if (roleHeader) {
          await roles.getRole(roleHeader)
          roleId = roleHeader

          // Delete admin and builder flags so that the specified role is honoured
          ctx.user = users.removePortalUserPermissions(ctx.user) as ContextUser
        }
      } catch (error) {
        // Swallow error and do nothing
      }
    }
  }

  // nothing more to do
  if (!appId) {
    return next()
  }

  return context.doInAppContext(appId, async () => {
    // if the user not in the right tenant then make sure they have no permissions
    // need to judge this only based on the request app ID,
    if (
      env.MULTI_TENANCY &&
      ctx.user?._id &&
      requestAppId &&
      !tenancy.isUserInAppTenant(requestAppId, ctx.user)
    ) {
      // don't error, simply remove the users rights (they are a public user)
      ctx.user = users.cleanseUserObject(ctx.user) as ContextUser
      ctx.isAuthenticated = false
      roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
    }

    ctx.appId = appId
    if (roleId) {
      ctx.roleId = roleId
      const globalId = ctx.user ? ctx.user._id : undefined
      const userId = ctx.user
        ? generateUserMetadataID(ctx.user._id!)
        : undefined
      ctx.user = {
        ...ctx.user!,
        // override userID with metadata one
        _id: userId,
        userId,
        globalId,
        roleId,
        role: await roles.getRole(roleId, { defaultPublic: true }),
      }
    }

    return next()
  })
}

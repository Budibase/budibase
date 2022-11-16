import {
  utils,
  constants,
  roles,
  db as dbCore,
  tenancy,
  context,
} from "@budibase/backend-core"
import { generateUserMetadataID, isDevAppID } from "../db/utils"
import { getCachedSelf } from "../utilities/global"
import env from "../environment"
import { isWebhookEndpoint } from "./utils"
import { BBContext } from "@budibase/types"

export = async (ctx: BBContext, next: any) => {
  // try to get the appID from the request
  let requestAppId = await utils.getAppIdFromCtx(ctx)
  // get app cookie if it exists
  let appCookie: { appId?: string } | undefined
  try {
    appCookie = utils.getCookie(ctx, constants.Cookie.CurrentApp)
  } catch (err) {
    utils.clearCookie(ctx, constants.Cookie.CurrentApp)
  }
  if (!appCookie && !requestAppId) {
    return next()
  }
  // check the app exists referenced in cookie
  if (appCookie) {
    const appId = appCookie.appId
    const exists = await dbCore.dbExists(appId)
    if (!exists) {
      utils.clearCookie(ctx, constants.Cookie.CurrentApp)
      return next()
    }
    // if the request app ID wasn't set, update it with the cookie
    requestAppId = requestAppId || appId
  }

  // deny access to application preview
  if (!env.isTest()) {
    if (
      isDevAppID(requestAppId) &&
      !isWebhookEndpoint(ctx) &&
      (!ctx.user || !ctx.user.builder || !ctx.user.builder.global)
    ) {
      utils.clearCookie(ctx, constants.Cookie.CurrentApp)
      return ctx.redirect("/")
    }
  }

  let appId: string | undefined,
    roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  if (!ctx.user) {
    // not logged in, try to set a cookie for public apps
    appId = requestAppId
  } else if (requestAppId != null) {
    // Different App ID means cookie needs reset, or if the same public user has logged in
    const globalUser = await getCachedSelf(ctx, requestAppId)
    appId = requestAppId
    // retrieving global user gets the right role
    roleId = globalUser.roleId || roleId

    // Allow builders to specify their role via a header
    const isBuilder =
      globalUser && globalUser.builder && globalUser.builder.global
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
          delete ctx.user.builder
          delete ctx.user.admin
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
    let skipCookie = false
    // if the user not in the right tenant then make sure they have no permissions
    // need to judge this only based on the request app ID,
    if (
      env.MULTI_TENANCY &&
      ctx.user &&
      requestAppId &&
      !tenancy.isUserInAppTenant(requestAppId, ctx.user)
    ) {
      // don't error, simply remove the users rights (they are a public user)
      delete ctx.user.builder
      delete ctx.user.admin
      delete ctx.user.roles
      ctx.isAuthenticated = false
      roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
      skipCookie = true
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
        role: await roles.getRole(roleId),
      }
    }
    if (
      (requestAppId !== appId ||
        appCookie == null ||
        appCookie.appId !== requestAppId) &&
      !skipCookie
    ) {
      utils.setCookie(ctx, { appId }, constants.Cookie.CurrentApp)
    }

    return next()
  })
}

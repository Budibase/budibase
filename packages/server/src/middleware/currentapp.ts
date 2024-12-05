import {
  utils,
  constants,
  roles,
  tenancy,
  context,
  users,
  auth,
} from "@budibase/backend-core"
import { generateUserMetadataID, isDevAppID } from "../db/utils"
import { getCachedSelf } from "../utilities/global"
import env from "../environment"
import { isWebhookEndpoint, isBrowser, isApiKey } from "./utils"
import { UserCtx, ContextUser } from "@budibase/types"
import tracer from "dd-trace"
import type { Middleware, Next } from "koa"

const middleware = (async (ctx: UserCtx, next: Next) => {
  // try to get the appID from the request
  let requestAppId = await utils.getAppIdFromCtx(ctx)
  if (!requestAppId) {
    return next()
  }

  if (requestAppId) {
    const span = tracer.scope().active()
    span?.setTag("appId", requestAppId)
  }

  // deny access to application preview
  if (isBrowser(ctx) && !isApiKey(ctx)) {
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
      roleId = roleHeader
      // Delete admin and builder flags so that the specified role is honoured
      ctx.user = users.removePortalUserPermissions(ctx.user) as ContextUser
    }
  }

  // nothing more to do
  if (!appId) {
    return next()
  }

  if (ctx.user) {
    const span = tracer.scope().active()
    if (ctx.user._id) {
      span?.setTag("userId", ctx.user._id)
    }
    span?.setTag("tenantId", ctx.user.tenantId)
  }

  const userId = ctx.user ? generateUserMetadataID(ctx.user._id!) : undefined

  // if the user is not in the right tenant then make sure to wipe their cookie
  // also cleanse any information about them that has been allocated
  // this avoids apps making calls to say the worker which are cross tenant,
  // we simply remove the authentication
  if (
    env.MULTI_TENANCY &&
    userId &&
    requestAppId &&
    !tenancy.isUserInAppTenant(requestAppId, ctx.user)
  ) {
    // clear out the user
    ctx.user = users.cleanseUserObject(ctx.user) as ContextUser
    ctx.isAuthenticated = false
    roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
    // remove the cookie, so future calls are public
    await auth.platformLogout({
      ctx,
      userId,
    })
  }

  return context.doInAppContext(appId, async () => {
    ctx.appId = appId
    if (roleId) {
      ctx.roleId = roleId
      const globalId = ctx.user ? ctx.user._id : undefined
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
}) as Middleware

export default middleware

import {
  auth,
  constants,
  context,
  roles,
  tenancy,
  users,
  utils,
} from "@budibase/backend-core"
import { ContextUser, UserCtx } from "@budibase/types"
import tracer from "dd-trace"
import type { Middleware, Next } from "koa"
import { generateUserMetadataID, isDevWorkspaceID } from "../db/utils"
import env from "../environment"
import { getCachedSelf } from "../utilities/global"
import { isApiKey, isBrowser, isWebhookEndpoint } from "./utils"

export const currentWorkspaceMiddleware = (async (ctx: UserCtx, next: Next) => {
  // try to get the workspaceID from the request
  let requestWorkspaceId = await utils.getWorkspaceIdFromCtx(ctx)
  if (!requestWorkspaceId) {
    return next()
  }

  if (requestWorkspaceId) {
    const span = tracer.scope().active()
    span?.setTag("appId", requestWorkspaceId)
  }

  // deny access to application preview
  if (isBrowser(ctx) && !isApiKey(ctx)) {
    if (
      isDevWorkspaceID(requestWorkspaceId) &&
      !isWebhookEndpoint(ctx) &&
      !users.isBuilder(ctx.user, requestWorkspaceId)
    ) {
      return ctx.redirect("/")
    }
  }

  let workspaceId: string | undefined,
    roleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  if (!ctx.user?._id) {
    // not logged in, try to set a cookie for public apps
    workspaceId = requestWorkspaceId
  } else if (requestWorkspaceId != null) {
    // Different Workspace ID means cookie needs reset, or if the same public user has logged in
    const globalUser = await getCachedSelf(ctx, requestWorkspaceId)
    workspaceId = requestWorkspaceId
    // retrieving global user gets the right role
    roleId = globalUser.roleId || roleId

    // Allow builders to specify their role via a header
    const isBuilder = users.isBuilder(globalUser, workspaceId)
    const isDev = workspaceId && isDevWorkspaceID(workspaceId)
    const roleHeader =
      ctx.request &&
      (ctx.request.headers[constants.Header.PREVIEW_ROLE] as string)
    if (isBuilder && isDev && roleHeader) {
      roleId = roleHeader
      // Delete admin and builder flags so that the specified role is honoured
      ctx.user = users.removePortalUserPermissions(ctx.user) as ContextUser
    }
  }

  // nothing more to do
  if (!workspaceId) {
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
    requestWorkspaceId &&
    !tenancy.isUserInWorkspaceTenant(requestWorkspaceId, ctx.user)
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

  return context.doInWorkspaceContext(workspaceId, async () => {
    ctx.appId = workspaceId
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

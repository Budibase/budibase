import { Cookie, cache, context, utils } from "@budibase/backend-core"
import { features } from "@budibase/pro"
import { ClientHeader, Header, sdk } from "@budibase/shared-core"
import { RecaptchaSessionCookie, UserCtx, Workspace } from "@budibase/types"
import { Middleware, Next } from "koa"
import { isProdWorkspaceID } from "../db/utils"
import { isRecaptchaVerified } from "../utilities/redis"

const middleware = (async (ctx: UserCtx, next: Next) => {
  const workspaceId = context.getWorkspaceId()
  // no app ID, requests are not targeting an app
  // if not production app - this is in the builder, recaptcha isn't enabled
  if (!workspaceId || !isProdWorkspaceID(workspaceId)) {
    return next()
  }
  if (!(await features.isRecaptchaEnabled())) {
    return next()
  }
  // builder users can skip validation if request comes from the builder
  if (
    sdk.users.isBuilder(ctx.user) &&
    ctx.headers[Header.CLIENT] === ClientHeader.BUILDER
  ) {
    return next()
  }
  const app = await cache.workspace.getWorkspaceMetadata(workspaceId)
  if ("state" in app && app.state === cache.workspace.WorkspaceState.INVALID) {
    throw new Error("App not found")
  }
  if ((app as Workspace).recaptchaEnabled) {
    const cookie = utils.getCookie<RecaptchaSessionCookie>(
      ctx,
      Cookie.RecaptchaSession
    )
    if (!cookie) {
      ctx.status = 498
      return
    }
    const verified = await isRecaptchaVerified(cookie.sessionId)
    if (!verified) {
      ctx.status = 498
      return
    }
  }
  return next()
}) as Middleware

export default middleware

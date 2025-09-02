import { UserCtx, RecaptchaSessionCookie, Workspace } from "@budibase/types"
import { utils, Cookie, cache, context } from "@budibase/backend-core"
import { Header, ClientHeader, sdk } from "@budibase/shared-core"
import { features } from "@budibase/pro"
import { Middleware, Next } from "koa"
import { isRecaptchaVerified } from "../utilities/redis"
import { isProdAppID } from "../db/utils"

const middleware = (async (ctx: UserCtx, next: Next) => {
  const appId = context.getWorkspaceId()
  // no app ID, requests are not targeting an app
  // if not production app - this is in the builder, recaptcha isn't enabled
  if (!appId || !isProdAppID(appId)) {
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
  const app = await cache.app.getWorkspaceMetadata(appId)
  if ("state" in app && app.state === cache.app.WorkspaceState.INVALID) {
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

import { Ctx, RecaptchaSessionCookie, App } from "@budibase/types"
import { utils, Cookie, cache, context } from "@budibase/backend-core"
import { Next } from "koa"
import { isRecaptchaVerified } from "../utilities/redis"

const middleware = async (ctx: Ctx, next: Next) => {
  const appId = context.getAppId()
  if (!appId) {
    throw new Error("Middleware must be used with app context")
  }
  const app = await cache.app.getAppMetadata(appId)
  if ("state" in app && app.state === cache.app.AppState.INVALID) {
    throw new Error("App not found")
  }
  if ((app as App).recaptchaEnabled) {
    const cookie = utils.getCookie<RecaptchaSessionCookie>(
      ctx,
      Cookie.RecaptchaSession
    )
    if (!cookie) {
      ctx.status = 403
      return
    }
    const verified = await isRecaptchaVerified(cookie.sessionId)
    if (!verified) {
      ctx.status = 403
      return
    }
  }
  return next()
}

export default middleware

import { Ctx, RecaptchaSessionCookie } from "@budibase/types"
import { utils, Cookie } from "@budibase/backend-core"
import { Next } from "koa"
import env from "../environment"
import { isRecaptchaVerified } from "../utilities/redis"

const middleware = async (ctx: Ctx, next: Next) => {
  // TODO: need to check this per app
  if (env.RECAPTCHA_SITE_KEY) {
    const cookie = utils.getCookie<RecaptchaSessionCookie>(ctx, Cookie.RecaptchaSession)
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
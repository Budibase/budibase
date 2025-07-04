import { Ctx, RecaptchaSessionCookie } from "@budibase/types"
import { utils, Cookie, configs } from "@budibase/backend-core"
import { Next } from "koa"
import { isRecaptchaVerified } from "../utilities/redis"

const middleware = async (ctx: Ctx, next: Next) => {
  const enabled = await configs.recaptchaEnabled()
  if (enabled) {
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

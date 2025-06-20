import {
  Ctx,
  VerifyRecaptchaRequest,
  VerifyRecaptchaResponse,
  CheckRecaptchaResponse,
} from "@budibase/types"
import env from "../../environment"
import { utils, Cookie } from "@budibase/backend-core"
import {
  setRecaptchaVerified,
  isRecaptchaVerified,
} from "../../utilities/redis"

type RecaptchaSessionCookie = { sessionId: string }

export async function verify(
  ctx: Ctx<VerifyRecaptchaRequest, VerifyRecaptchaResponse>
) {
  const { token } = ctx.request.body

  if (!token) {
    throw new Error("Token not found")
  }

  // keys not available, not supported
  // TODO: get keys from app settings
  if (!env.RECAPTCHA_SECRET_KEY) {
    ctx.status = 501
    return
  }

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    }
  )

  const { success } = await response.json()
  const verified = success === true
  if (verified) {
    const sessionId = await setRecaptchaVerified()
    const session: RecaptchaSessionCookie = {
      sessionId,
    }
    utils.setCookie(ctx, session, Cookie.RecaptchaSession)
  }

  ctx.body = {
    verified,
  }
}

export async function check(ctx: Ctx<void, CheckRecaptchaResponse>) {
  const cookie = utils.getCookie<RecaptchaSessionCookie>(
    ctx,
    Cookie.RecaptchaSession
  )
  if (!cookie) {
    ctx.body = { verified: false }
    return
  }
  const verified = await isRecaptchaVerified(cookie.sessionId)
  if (!verified) {
    utils.clearCookie(ctx, Cookie.RecaptchaSession)
    ctx.body = { verified: false }
    return
  }

  ctx.body = { verified: true }
}

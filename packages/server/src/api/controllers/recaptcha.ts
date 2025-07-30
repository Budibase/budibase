import {
  Ctx,
  VerifyRecaptchaRequest,
  VerifyRecaptchaResponse,
  CheckRecaptchaResponse,
  RecaptchaSessionCookie,
} from "@budibase/types"
import { utils, Cookie, configs, UnexpectedError } from "@budibase/backend-core"
import {
  setRecaptchaVerified,
  isRecaptchaVerified,
} from "../../utilities/redis"
import fetch from "node-fetch"

export async function verify(
  ctx: Ctx<VerifyRecaptchaRequest, VerifyRecaptchaResponse>
) {
  const { token } = ctx.request.body

  if (!token) {
    throw new Error("Recaptcha token not found")
  }

  const config = await configs.getRecaptchaConfig()
  if (!config) {
    throw new Error("No recaptcha config found")
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: config.config.secretKey,
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
  } catch (error: any) {
    throw new UnexpectedError(
      `Failed to verify recaptcha token - ${error.message}`
    )
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

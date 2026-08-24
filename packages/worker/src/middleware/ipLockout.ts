import { Ctx } from "@budibase/types"
import { Next } from "koa"
import env from "../environment"
import { getClientIp } from "../utilities/clientIp"
import { failedAttemptsForIp } from "../utilities/loginAttempts"

/**
 * Middleware to block login attempts from an address that has already failed
 * LOGIN_IP_LOCKOUT_LIMIT times inside the LOGIN_LOCKOUT_SECONDS window.
 *
 * This only reads the counter - the login controller records failures once
 * authentication has actually been attempted.
 */
export default async (ctx: Ctx, next: Next) => {
  const ip = getClientIp(ctx)

  if (!ip) {
    return await next()
  }

  const failures = await failedAttemptsForIp(ip)

  if (failures >= env.LOGIN_IP_LOCKOUT_LIMIT) {
    ctx.set("Retry-After", String(env.LOGIN_LOCKOUT_SECONDS))
    console.log(
      `[auth] login blocked due to IP lockout ip=${ip} failures=${failures}`
    )
    return ctx.throw(429, "Too many login attempts. Try again later.")
  }

  return await next()
}

import { cache } from "@budibase/backend-core"
import { Ctx } from "@budibase/types"
import { Next } from "koa"
import env from "../environment"

const ipKey = (ip: string) => `auth:login:ip:${ip}`

/**
 * Middleware to rate-limit login attempts by source IP.
 * Blocks with 429 once the request count exceeds LOGIN_IP_LOCKOUT_LIMIT
 * within the LOGIN_LOCKOUT_SECONDS window.
 */
export default async (ctx: Ctx, next: Next) => {
  const ip = (ctx.ip || "").toString()

  if (!ip) {
    return await next()
  }

  const key = ipKey(ip)
  const count = await cache.increment(key, env.LOGIN_LOCKOUT_SECONDS)

  if (count > env.LOGIN_IP_LOCKOUT_LIMIT) {
    ctx.set("Retry-After", String(env.LOGIN_LOCKOUT_SECONDS))
    console.log(
      `[auth] login blocked due to IP lockout ip=${ip} count=${count}`
    )
    return ctx.throw(429, "Too many login attempts. Try again later.")
  }

  return await next()
}

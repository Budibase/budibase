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
  const current = Number((await cache.get(key)) || 0)
  const nextCount = current + 1
  await cache.store(key, nextCount, env.LOGIN_LOCKOUT_SECONDS)

  if (nextCount > env.LOGIN_IP_LOCKOUT_LIMIT) {
    ctx.set("Retry-After", String(env.LOGIN_LOCKOUT_SECONDS))
    console.log(
      `[auth] login blocked due to IP lockout ip=${ip} count=${nextCount}`
    )
    return ctx.throw(429, "Too many login attempts. Try again later.")
  }

  return await next()
}

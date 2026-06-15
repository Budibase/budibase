import { cache } from "@budibase/backend-core"
import { Ctx } from "@budibase/types"
import { Next } from "koa"
import env from "../environment"
import * as userSdk from "../sdk/users"

const normalizeEmail = (e: string) => (e || "").toLowerCase()
const lockKey = (email: string) => `auth:login:lock:${normalizeEmail(email)}`

const isLocked = async (email: string) => {
  return !!(await cache.get(lockKey(email)))
}

/**
 * Middleware to check if an account is locked due to failed login attempts.
 * If locked, returns 403 with appropriate headers.
 */
export default async (ctx: Ctx, next: Next) => {
  const email = ctx.request.body.username

  if (!email) {
    return await next()
  }

  const dbUser = await userSdk.db.getUserByEmail(email)
  if (dbUser && (await isLocked(email))) {
    console.log(
      `[auth] login blocked due to lock email=${normalizeEmail(email)}`
    )
    ctx.set("X-Account-Locked", "1")
    ctx.set("Retry-After", String(env.LOGIN_LOCKOUT_SECONDS))
    ctx.throw(403, "Account temporarily locked. Try again later.")
  }

  return await next()
}

import { cache } from "@budibase/backend-core"
import env from "../environment"

/**
 * Bookkeeping for the per-address login lockout, shared between the `ipLockout`
 * middleware (which only reads) and the login controller (which records the
 * failures). Only failed authentications count towards the limit - counting
 * every request meant that a handful of colleagues signing in normally from one
 * office could lock their whole tenant out (budibase/budibase#19525).
 */

export const ipKey = (ip: string) => `auth:login:ip:${ip}`

export const failedAttemptsForIp = async (ip: string): Promise<number> => {
  return Number((await cache.get(ipKey(ip))) || 0) || 0
}

export const recordFailedAttemptForIp = async (ip: string): Promise<number> => {
  return cache.increment(ipKey(ip), env.LOGIN_LOCKOUT_SECONDS)
}

export const clearFailedAttemptsForIp = async (ip: string): Promise<void> => {
  await cache.destroy(ipKey(ip))
}

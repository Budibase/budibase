import { DocumentType, SEPARATOR, ViewName, getAllApps } from "./db/utils"
const jwt = require("jsonwebtoken")
import { options } from "./middleware/passport/jwt"
import { queryGlobalView } from "./db/views"
import { Headers, Cookies, MAX_VALID_DATE } from "./constants"
import env from "./environment"
import userCache from "./cache/user"
import { getSessionsForUser, invalidateSessions } from "./security/sessions"
import * as events from "./events"
import tenancy from "./tenancy"
import { App, BBContext, TenantResolutionStrategy } from "@budibase/types"
import { SetOption } from "cookies"

const APP_PREFIX = DocumentType.APP + SEPARATOR
const PROD_APP_PREFIX = "/app/"

function confirmAppId(possibleAppId: string | undefined) {
  return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
    ? possibleAppId
    : undefined
}

async function resolveAppUrl(ctx: BBContext) {
  const appUrl = ctx.path.split("/")[2]
  let possibleAppUrl = `/${appUrl.toLowerCase()}`

  let tenantId = tenancy.getTenantId()
  if (!env.SELF_HOSTED) {
    // always use the tenant id from the subdomain in cloud
    // this ensures the logged-in user tenant id doesn't overwrite
    // e.g. in the case of viewing a public app while already logged-in to another tenant
    tenantId = tenancy.getTenantIDFromCtx(ctx, {
      includeStrategies: [TenantResolutionStrategy.SUBDOMAIN],
    })
  }

  // search prod apps for a url that matches
  const apps: App[] = await tenancy.doInTenant(tenantId, () =>
    getAllApps({ dev: false })
  )
  const app = apps.filter(
    a => a.url && a.url.toLowerCase() === possibleAppUrl
  )[0]

  return app && app.appId ? app.appId : undefined
}

export const isServingApp = (ctx: BBContext) => {
  // dev app
  if (ctx.path.startsWith(`/${APP_PREFIX}`)) {
    return true
  }
  // prod app
  if (ctx.path.startsWith(PROD_APP_PREFIX)) {
    return true
  }
  return false
}

/**
 * Given a request tries to find the appId, which can be located in various places
 * @param {object} ctx The main request body to look through.
 * @returns {string|undefined} If an appId was found it will be returned.
 */
export const getAppIdFromCtx = async (ctx: BBContext) => {
  // look in headers
  const options = [ctx.headers[Headers.APP_ID]]
  let appId
  for (let option of options) {
    appId = confirmAppId(option as string)
    if (appId) {
      break
    }
  }

  // look in body
  if (!appId && ctx.request.body && ctx.request.body.appId) {
    appId = confirmAppId(ctx.request.body.appId)
  }

  // look in the url - dev app
  let appPath =
    ctx.request.headers.referrer ||
    ctx.path.split("/").filter(subPath => subPath.startsWith(APP_PREFIX))
  if (!appId && appPath.length) {
    appId = confirmAppId(appPath[0])
  }

  // look in the url - prod app
  if (!appId && ctx.path.startsWith(PROD_APP_PREFIX)) {
    appId = confirmAppId(await resolveAppUrl(ctx))
  }

  return appId
}

/**
 * opens the contents of the specified encrypted JWT.
 * @return {object} the contents of the token.
 */
export const openJwt = (token: string) => {
  if (!token) {
    return token
  }
  return jwt.verify(token, options.secretOrKey)
}

/**
 * Get a cookie from context, and decrypt if necessary.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to get.
 */
export const getCookie = (ctx: BBContext, name: string) => {
  const cookie = ctx.cookies.get(name)

  if (!cookie) {
    return cookie
  }

  return openJwt(cookie)
}

/**
 * Store a cookie for the request - it will not expire.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to set.
 * @param {string|object} value The value of cookie which will be set.
 * @param {object} opts options like whether to sign.
 */
export const setCookie = (
  ctx: BBContext,
  value: any,
  name = "builder",
  opts = { sign: true }
) => {
  if (value && opts && opts.sign) {
    value = jwt.sign(value, options.secretOrKey)
  }

  const config: SetOption = {
    expires: MAX_VALID_DATE,
    path: "/",
    httpOnly: false,
    overwrite: true,
  }

  if (env.COOKIE_DOMAIN) {
    config.domain = env.COOKIE_DOMAIN
  }

  ctx.cookies.set(name, value, config)
}

/**
 * Utility function, simply calls setCookie with an empty string for value
 */
export const clearCookie = (ctx: BBContext, name: string) => {
  setCookie(ctx, null, name)
}

/**
 * Checks if the API call being made (based on the provided ctx object) is from the client. If
 * the call is not from a client app then it is from the builder.
 * @param {object} ctx The koa context object to be tested.
 * @return {boolean} returns true if the call is from the client lib (a built app rather than the builder).
 */
export const isClient = (ctx: BBContext) => {
  return ctx.headers[Headers.TYPE] === "client"
}

const getBuilders = async () => {
  const builders = await queryGlobalView(ViewName.USER_BY_BUILDERS, {
    include_docs: false,
  })

  if (!builders) {
    return []
  }

  if (Array.isArray(builders)) {
    return builders
  } else {
    return [builders]
  }
}

export const getBuildersCount = async () => {
  const builders = await getBuilders()
  return builders.length
}

interface PlatformLogoutOpts {
  ctx: BBContext
  userId: string
  keepActiveSession: boolean
}

/**
 * Logs a user out from budibase. Re-used across account portal and builder.
 */
export const platformLogout = async (opts: PlatformLogoutOpts) => {
  const ctx = opts.ctx
  const userId = opts.userId
  const keepActiveSession = opts.keepActiveSession

  if (!ctx) throw new Error("Koa context must be supplied to logout.")

  const currentSession = getCookie(ctx, Cookies.Auth)
  let sessions = await getSessionsForUser(userId)

  if (keepActiveSession) {
    sessions = sessions.filter(
      session => session.sessionId !== currentSession.sessionId
    )
  } else {
    // clear cookies
    clearCookie(ctx, Cookies.Auth)
    clearCookie(ctx, Cookies.CurrentApp)
  }

  const sessionIds = sessions.map(({ sessionId }) => sessionId)
  await invalidateSessions(userId, { sessionIds, reason: "logout" })
  await events.auth.logout()
  await userCache.invalidateUser(userId)
}

export const timeout = (timeMs: number) => {
  return new Promise(resolve => setTimeout(resolve, timeMs))
}

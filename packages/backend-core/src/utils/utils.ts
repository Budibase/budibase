import { getAllApps, queryGlobalView } from "../db"
import { options } from "../middleware/passport/jwt"
import {
  Header,
  Cookie,
  MAX_VALID_DATE,
  DocumentType,
  SEPARATOR,
  ViewName,
} from "../constants"
import env from "../environment"
import * as userCache from "../cache/user"
import { getSessionsForUser, invalidateSessions } from "../security/sessions"
import * as events from "../events"
import * as tenancy from "../tenancy"
import {
  App,
  Ctx,
  PlatformLogoutOpts,
  TenantResolutionStrategy,
} from "@budibase/types"
import { SetOption } from "cookies"
const jwt = require("jsonwebtoken")

const APP_PREFIX = DocumentType.APP + SEPARATOR
const PROD_APP_PREFIX = "/app/"

const BUILDER_PREVIEW_PATH = "/app/preview"
const BUILDER_REFERER_PREFIX = "/builder/app/"

function confirmAppId(possibleAppId: string | undefined) {
  return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
    ? possibleAppId
    : undefined
}

export async function resolveAppUrl(ctx: Ctx) {
  const appUrl = ctx.path.split("/")[2]
  let possibleAppUrl = `/${appUrl.toLowerCase()}`

  let tenantId: string | null = tenancy.getTenantId()
  if (env.MULTI_TENANCY) {
    // always use the tenant id from the subdomain in multi tenancy
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

export function isServingApp(ctx: Ctx) {
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
export async function getAppIdFromCtx(ctx: Ctx) {
  // look in headers
  const options = [ctx.request.headers[Header.APP_ID]]
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

  // look in the path
  const pathId = parseAppIdFromUrl(ctx.path)
  if (!appId && pathId) {
    appId = confirmAppId(pathId)
  }

  // lookup using custom url - prod apps only
  // filter out the builder preview path which collides with the prod app path
  // to ensure we don't load all apps excessively
  const isBuilderPreview = ctx.path.startsWith(BUILDER_PREVIEW_PATH)
  const isViewingProdApp =
    ctx.path.startsWith(PROD_APP_PREFIX) && !isBuilderPreview
  if (!appId && isViewingProdApp) {
    appId = confirmAppId(await resolveAppUrl(ctx))
  }

  // look in the referer - builder only
  // make sure this is performed after prod app url resolution, in case the
  // referer header is present from a builder redirect
  const referer = ctx.request.headers.referer
  if (!appId && referer?.includes(BUILDER_REFERER_PREFIX)) {
    const refererId = parseAppIdFromUrl(ctx.request.headers.referer)
    appId = confirmAppId(refererId)
  }

  return appId
}

function parseAppIdFromUrl(url?: string) {
  if (!url) {
    return
  }
  return url.split("/").find(subPath => subPath.startsWith(APP_PREFIX))
}

/**
 * opens the contents of the specified encrypted JWT.
 * @return {object} the contents of the token.
 */
export function openJwt(token: string) {
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
export function getCookie(ctx: Ctx, name: string) {
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
export function setCookie(
  ctx: Ctx,
  value: any,
  name = "builder",
  opts = { sign: true }
) {
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
export function clearCookie(ctx: Ctx, name: string) {
  setCookie(ctx, null, name)
}

/**
 * Checks if the API call being made (based on the provided ctx object) is from the client. If
 * the call is not from a client app then it is from the builder.
 * @param {object} ctx The koa context object to be tested.
 * @return {boolean} returns true if the call is from the client lib (a built app rather than the builder).
 */
export function isClient(ctx: Ctx) {
  return ctx.headers[Header.TYPE] === "client"
}

async function getBuilders() {
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

export async function getBuildersCount() {
  const builders = await getBuilders()
  return builders.length
}

/**
 * Logs a user out from budibase. Re-used across account portal and builder.
 */
export async function platformLogout(opts: PlatformLogoutOpts) {
  const ctx = opts.ctx
  const userId = opts.userId
  const keepActiveSession = opts.keepActiveSession

  if (!ctx) throw new Error("Koa context must be supplied to logout.")

  const currentSession = getCookie(ctx, Cookie.Auth)
  let sessions = await getSessionsForUser(userId)

  if (keepActiveSession) {
    sessions = sessions.filter(
      session => session.sessionId !== currentSession.sessionId
    )
  } else {
    // clear cookies
    clearCookie(ctx, Cookie.Auth)
    clearCookie(ctx, Cookie.CurrentApp)
  }

  const sessionIds = sessions.map(({ sessionId }) => sessionId)
  await invalidateSessions(userId, { sessionIds, reason: "logout" })
  await events.auth.logout()
  await userCache.invalidateUser(userId)
}

export function timeout(timeMs: number) {
  return new Promise(resolve => setTimeout(resolve, timeMs))
}

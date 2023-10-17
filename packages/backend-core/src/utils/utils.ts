import { getAllApps } from "../db"
import { Header, MAX_VALID_DATE, DocumentType, SEPARATOR } from "../constants"
import env from "../environment"
import * as tenancy from "../tenancy"
import * as context from "../context"
import {
  App,
  AuditedEventFriendlyName,
  Ctx,
  Event,
  TenantResolutionStrategy,
} from "@budibase/types"
import type { SetOption } from "cookies"
const jwt = require("jsonwebtoken")

const APP_PREFIX = DocumentType.APP + SEPARATOR
const PROD_APP_PREFIX = "/app/"

const BUILDER_PREVIEW_PATH = "/app/preview"
const BUILDER_PREFIX = "/builder"
const BUILDER_APP_PREFIX = `${BUILDER_PREFIX}/app/`
const PUBLIC_API_PREFIX = "/api/public/v"

function confirmAppId(possibleAppId: string | undefined) {
  return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
    ? possibleAppId
    : undefined
}

export async function resolveAppUrl(ctx: Ctx) {
  const appUrl = ctx.path.split("/")[2]
  let possibleAppUrl = `/${appUrl.toLowerCase()}`

  let tenantId: string | null = context.getTenantId()
  if (env.MULTI_TENANCY) {
    // always use the tenant id from the subdomain in multi tenancy
    // this ensures the logged-in user tenant id doesn't overwrite
    // e.g. in the case of viewing a public app while already logged-in to another tenant
    tenantId = tenancy.getTenantIDFromCtx(ctx, {
      includeStrategies: [TenantResolutionStrategy.SUBDOMAIN],
    })
  }

  // search prod apps for a url that matches
  const apps: App[] = await context.doInTenant(
    tenantId,
    () => getAllApps({ dev: false }) as Promise<App[]>
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

export function isServingBuilder(ctx: Ctx): boolean {
  return ctx.path.startsWith(BUILDER_APP_PREFIX)
}

export function isServingBuilderPreview(ctx: Ctx): boolean {
  return ctx.path.startsWith(BUILDER_PREVIEW_PATH)
}

export function isPublicApiRequest(ctx: Ctx): boolean {
  return ctx.path.startsWith(PUBLIC_API_PREFIX)
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
  if (!appId && referer?.includes(BUILDER_APP_PREFIX)) {
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
  try {
    return jwt.verify(token, env.JWT_SECRET)
  } catch (e) {
    if (env.JWT_SECRET_FALLBACK) {
      // fallback to enable rotation
      return jwt.verify(token, env.JWT_SECRET_FALLBACK)
    } else {
      throw e
    }
  }
}

export function isValidInternalAPIKey(apiKey: string) {
  if (env.INTERNAL_API_KEY && env.INTERNAL_API_KEY === apiKey) {
    return true
  }
  // fallback to enable rotation
  if (
    env.INTERNAL_API_KEY_FALLBACK &&
    env.INTERNAL_API_KEY_FALLBACK === apiKey
  ) {
    return true
  }
  return false
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
    value = jwt.sign(value, env.JWT_SECRET)
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

export function timeout(timeMs: number) {
  return new Promise(resolve => setTimeout(resolve, timeMs))
}

export function isAudited(event: Event) {
  return !!AuditedEventFriendlyName[event]
}

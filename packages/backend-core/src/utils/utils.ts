import {
  AuditedEventFriendlyName,
  Ctx,
  Event,
  TenantResolutionStrategy,
  Workspace,
} from "@budibase/types"
import type { SetOption } from "cookies"
import jwt, { Secret } from "jsonwebtoken"
import { DocumentType, Header, MAX_VALID_DATE, SEPARATOR } from "../constants"
import * as context from "../context"
import { getAllWorkspaces } from "../db"
import env from "../environment"
import * as tenancy from "../tenancy"

const WORKSPACE_PREFIX = DocumentType.WORKSPACE + SEPARATOR
const PROD_APP_PREFIX = "/app/"

async function resolveAppUrl(ctx: Ctx) {
  const workspaceUrl = ctx.path.split("/")[2]
  let possibleUrl = `/${workspaceUrl.toLowerCase()}`

  let tenantId: string | undefined = context.getTenantId()
  if (!env.isDev() && env.MULTI_TENANCY) {
    // always use the tenant id from the subdomain in multi tenancy
    // this ensures the logged-in user tenant id doesn't overwrite
    // e.g. in the case of viewing a public app while already logged-in to another tenant
    tenantId = tenancy.getTenantIDFromCtx(ctx, {
      includeStrategies: [TenantResolutionStrategy.SUBDOMAIN],
    })
  }

  // search prod apps for an url that matches
  const workspaces: Workspace[] = await context.doInTenant(tenantId, () =>
    getAllWorkspaces({ dev: false })
  )
  const workspace = workspaces.filter(
    a => a.url && a.url.toLowerCase() === possibleUrl
  )[0]

  return workspace && workspace.appId ? workspace.appId : undefined
}

export function isServingApp(ctx: Ctx) {
  // dev workspace
  if (ctx.path.startsWith(`/${WORKSPACE_PREFIX}`)) {
    return true
  }
  // prod workspace
  return ctx.path.startsWith(PROD_APP_PREFIX)
}

export function isServingBuilder(ctx: Ctx): boolean {
  return ctx.path.startsWith("/builder/workspace/")
}

export function isServingBuilderPreview(ctx: Ctx): boolean {
  return isBuilderPreviewUrl(ctx.path)
}

function isBuilderPreviewUrl(path: string): boolean {
  return new RegExp(/^\/app\/app_\w+\/preview$/).test(path)
}

export function isPublicApiRequest(ctx: Ctx): boolean {
  return ctx.path.startsWith("/api/public/v")
}

/**
 * Given a request tries to find the appId, which can be located in various places
 * @param ctx The main request body to look through.
 * @returns If an appId was found it will be returned.
 */
export async function getWorkspaceIdFromCtx(ctx: Ctx) {
  let workspaceId: string | undefined

  function setWorkspaceIdIfValid(possibleWorkspaceId: string | undefined) {
    if (!possibleWorkspaceId) {
      return
    }

    if (!possibleWorkspaceId.startsWith(WORKSPACE_PREFIX)) {
      return
    }

    if (workspaceId && workspaceId !== possibleWorkspaceId) {
      ctx.throw("App id conflict", 403)
    }

    workspaceId = possibleWorkspaceId
    return
  }

  function checkPossibleValues(values: string | string[] | undefined) {
    if (!values) {
      return
    }

    if (typeof values === "string") {
      values = [values]
    }
    for (const value of values) {
      setWorkspaceIdIfValid(value)
    }
  }

  // look in headers
  checkPossibleValues(ctx.request.headers[Header.APP_ID])

  // look in body
  setWorkspaceIdIfValid(ctx.request.body?.appId)

  // look in the path
  const pathId = parseWorkspaceIdFromUrlPath(ctx.path)
  setWorkspaceIdIfValid(pathId)

  // look in queryParams
  checkPossibleValues(ctx.query?.appId)

  // lookup using custom url - prod apps only
  // filter out the builder preview path which collides with the prod app path
  // to ensure we don't load all apps excessively
  const isBuilderPreview = isBuilderPreviewUrl(ctx.path)
  const isViewingProdApp =
    ctx.path.startsWith(PROD_APP_PREFIX) && !isBuilderPreview
  if (isViewingProdApp) {
    setWorkspaceIdIfValid(await resolveAppUrl(ctx))
  }

  return workspaceId
}

function parseWorkspaceIdFromUrlPath(url?: string) {
  if (!url) {
    return
  }
  return url
    .split("?")[0] // Remove any possible query string
    .split("/")
    .find(subPath => subPath.startsWith(WORKSPACE_PREFIX))
}

/**
 * opens the contents of the specified encrypted JWT.
 * @return the contents of the token.
 */
export function openJwt<T>(token?: string): T | undefined {
  if (!token) {
    return undefined
  }
  try {
    return jwt.verify(token, env.JWT_SECRET as Secret) as T
  } catch (e) {
    if (env.JWT_SECRET_FALLBACK) {
      // fallback to enable rotation
      return jwt.verify(token, env.JWT_SECRET_FALLBACK) as T
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
  return !!(
    env.INTERNAL_API_KEY_FALLBACK && env.INTERNAL_API_KEY_FALLBACK === apiKey
  )
}

/**
 * Get a cookie from context, and decrypt if necessary.
 * @param ctx The request which is to be manipulated.
 * @param name The name of the cookie to get.
 */
export function getCookie<T>(ctx: Ctx, name: string) {
  const cookie = ctx.cookies.get(name)

  if (!cookie) {
    return undefined
  }

  return openJwt<T>(cookie)
}

/**
 * Store a cookie for the request - it will not expire.
 * @param ctx The request which is to be manipulated.
 * @param name The name of the cookie to set.
 * @param value The value of cookie which will be set.
 * @param opts options like whether to sign.
 */
export function setCookie(
  ctx: Ctx,
  value: any,
  name = "builder",
  opts = { sign: true }
) {
  if (value && opts && opts.sign) {
    value = jwt.sign(value, env.JWT_SECRET as Secret)
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
 * @param ctx The koa context object to be tested.
 * @return returns true if the call is from the client lib (a built app rather than the builder).
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

export function hasCircularStructure(json: any) {
  if (typeof json !== "object") {
    return false
  }
  try {
    JSON.stringify(json)
  } catch (err) {
    if (err instanceof Error && err?.message.includes("circular structure")) {
      return true
    }
  }
  return false
}

export function urlHasProtocol(url: string): boolean {
  return !!url.match(/^.+:\/\/.+$/)
}

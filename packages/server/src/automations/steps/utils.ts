import { blacklist } from "@budibase/backend-core"
import { ContextEmitter } from "@budibase/types"
import fetch, { Headers, RequestInit, Response } from "node-fetch"
import environment from "../../environment"

export function hasNullFilters(filters: any[] = []) {
  return (
    filters.length === 0 ||
    filters.some(filter => filter.value === null || filter.value === "")
  )
}

export async function getFetchResponse(fetched: Response) {
  let status = fetched.status,
    message
  const contentType = fetched.headers.get("content-type")
  try {
    if (contentType && contentType.indexOf("application/json") !== -1) {
      message = await fetched.json()
    } else {
      message = await fetched.text()
    }
  } catch (err) {
    message = "Failed to retrieve response"
  }
  return { status, message }
}

export async function throwIfBlacklisted(url: string) {
  const disableBlacklistForLocalDevelopment =
    environment.isDev() && !environment.isTest()
  if (
    !disableBlacklistForLocalDevelopment &&
    (await blacklist.isBlacklisted(url))
  ) {
    throw new Error("Cannot connect to URL.")
  }
}

function isRedirect(status: number) {
  return [301, 302, 303, 307, 308].includes(status)
}

const SENSITIVE_REDIRECT_HEADERS = [
  "authorization",
  "cookie",
  "cookie2",
  "proxy-authorization",
]

function shouldStripSensitiveHeadersForRedirect(
  currentUrl: string,
  redirectUrl: string
) {
  return new URL(currentUrl).origin !== new URL(redirectUrl).origin
}

function stripSensitiveHeadersForRedirect(
  request: RedirectSafeRequest
): RedirectSafeRequest {
  if (!request.headers) {
    return request
  }

  const headers = new Headers(request.headers)
  SENSITIVE_REDIRECT_HEADERS.forEach(header => {
    headers.delete(header)
  })
  return {
    ...request,
    headers,
  }
}

function nextRequestForRedirect(
  request: RedirectSafeRequest,
  responseStatus: number
): RedirectSafeRequest {
  const method = request.method?.toUpperCase() || "GET"
  const shouldChangeToGet =
    responseStatus === 303 ||
    ((responseStatus === 301 || responseStatus === 302) && method === "POST")

  if (!shouldChangeToGet) {
    return request
  }

  return {
    ...request,
    body: undefined,
    method: "GET",
    redirect: "manual",
  }
}

interface RedirectSafeRequest extends RequestInit {
  redirect: "manual"
}

export async function fetchWithBlacklist(
  url: string,
  request: RequestInit = {}
): Promise<Response> {
  const maxRedirects = 5
  let nextUrl = url
  let nextRequest: RedirectSafeRequest = {
    ...request,
    redirect: "manual",
  }

  for (let redirects = 0; redirects <= maxRedirects; redirects++) {
    await throwIfBlacklisted(nextUrl)
    const response = await fetch(nextUrl, nextRequest)
    if (!isRedirect(response.status)) {
      return response
    }

    if (redirects === maxRedirects) {
      break
    }

    const location = response.headers.get("location")
    if (!location) {
      return response
    }

    const redirectUrl = new URL(location, nextUrl).toString()
    nextRequest = nextRequestForRedirect(nextRequest, response.status)
    if (shouldStripSensitiveHeadersForRedirect(nextUrl, redirectUrl)) {
      nextRequest = stripSensitiveHeadersForRedirect(nextRequest)
    }
    nextUrl = redirectUrl
  }

  throw new Error("Maximum redirect reached.")
}

// need to make sure all ctx structures have the
// throw added to them, so that controllers don't
// throw a ctx.throw undefined when error occurs
// opts can contain, body, params, version, and user
export function buildCtx(
  appId: string,
  emitter?: ContextEmitter | null,
  opts: any = {}
) {
  const ctx: any = {
    appId,
    user: opts.user || { appId },
    eventEmitter: emitter,
    throw: (_code: string, error: any) => {
      throw error
    },
  }
  if (opts.body) {
    ctx.request = { body: opts.body }
  }
  if (opts.params) {
    ctx.params = opts.params
  }
  if (opts.version) {
    ctx.version = opts.version
  }
  return ctx
}

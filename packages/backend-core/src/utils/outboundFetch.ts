import http from "http"
import https from "https"
import { isBlacklisted, resolveAddress } from "../blacklist"
import fetch, { Headers, RequestInit, Response } from "node-fetch"
import type { LookupFunction } from "net"

const MAX_REDIRECTS = 5
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"])
const SENSITIVE_REDIRECT_HEADERS = [
  "authorization",
  "cookie",
  "cookie2",
  "proxy-authorization",
]

function parseUrl(url: string): URL {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error("Invalid URL.")
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error("Only HTTP(S) URLs are allowed.")
  }

  if (parsed.username || parsed.password) {
    throw new Error("URL must not include credentials.")
  }

  return parsed
}

function isRedirect(status: number): boolean {
  return [301, 302, 303, 307, 308].includes(status)
}

async function resolveSafePinnedIp(url: string): Promise<string> {
  const parsed = parseUrl(url)
  const addresses = await resolveAddress(parsed.hostname)
  if (addresses.length === 0) {
    throw new Error("URL is blocked or could not be resolved safely.")
  }

  for (const address of addresses) {
    if (await isBlacklisted(address)) {
      throw new Error("URL is blocked or could not be resolved safely.")
    }
  }

  return addresses[0]
}

function makePinnedAgent(url: string, ip: string): http.Agent | https.Agent {
  const protocol = new URL(url).protocol
  const lookup: LookupFunction = (_hostname, _options, callback) => {
    const family = ip.includes(":") ? 6 : 4
    if (typeof _options === "object" && _options?.all) {
      callback(null, [{ address: ip, family }])
      return
    }
    callback(null, ip, family)
  }
  return protocol === "https:"
    ? new https.Agent({ lookup })
    : new http.Agent({ lookup })
}

function nextRequestForRedirect<TRequest extends FetchRequest>(
  request: RedirectSafeRequest<TRequest>,
  responseStatus: number
): RedirectSafeRequest<TRequest> {
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
  } as RedirectSafeRequest<TRequest>
}

function shouldStripSensitiveHeadersForRedirect(
  currentUrl: string,
  redirectUrl: string
): boolean {
  return new URL(currentUrl).origin !== new URL(redirectUrl).origin
}

function stripSensitiveHeadersForRedirect<TRequest extends FetchRequest>(
  request: RedirectSafeRequest<TRequest>
): RedirectSafeRequest<TRequest> {
  if (!request.headers) {
    return request
  }
  const headers = new Headers(request.headers as RequestInit["headers"])
  SENSITIVE_REDIRECT_HEADERS.forEach(header => headers.delete(header))
  return {
    ...request,
    headers,
  } as RedirectSafeRequest<TRequest>
}

interface FetchRequest {
  method?: string
  body?: unknown
  headers?: unknown
  redirect?: unknown
  agent?: unknown
}

interface FetchResponse {
  status: number
  headers: {
    get(name: string): string | null
  }
  body?: unknown
}

interface FetchWithBlacklistOptions<
  TRequest extends FetchRequest,
  TResponse extends FetchResponse,
> {
  followRedirects?: boolean
  returnRedirectWithoutLocation?: boolean
  fetchFn?: (
    url: string,
    request: RedirectSafeRequest<TRequest>
  ) => Promise<TResponse>
}

type RedirectSafeRequest<TRequest extends FetchRequest> = TRequest & {
  redirect: "manual"
}

function isResumableBody(body: unknown): body is { resume: () => void } {
  if (!body || typeof body !== "object") {
    return false
  }

  if (!("resume" in body)) {
    return false
  }

  return typeof body.resume === "function"
}

function releaseResponseBody(response: FetchResponse) {
  const body = response.body
  if (!isResumableBody(body)) {
    return
  }

  body.resume()
}

export async function fetchWithBlacklist<
  TRequest extends FetchRequest = RequestInit,
  TResponse extends FetchResponse = Response,
>(
  url: string,
  request: TRequest = {} as TRequest,
  {
    followRedirects = true,
    returnRedirectWithoutLocation = false,
    fetchFn = fetch as unknown as (
      url: string,
      request: RedirectSafeRequest<TRequest>
    ) => Promise<TResponse>,
  }: FetchWithBlacklistOptions<TRequest, TResponse> = {}
): Promise<TResponse> {
  let nextUrl = url
  let nextRequest: RedirectSafeRequest<TRequest> = {
    ...request,
    redirect: "manual",
  }

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    const pinnedIp = await resolveSafePinnedIp(nextUrl)
    let response: TResponse
    try {
      response = await fetchFn(nextUrl, {
        ...nextRequest,
        agent: makePinnedAgent(nextUrl, pinnedIp),
      })
    } catch (error) {
      const hostname = parseUrl(nextUrl).hostname
      if (error instanceof Error) {
        error.message = `Failed to connect to resolved IP for ${hostname}: ${error.message}`
        throw error
      }
      throw new Error(
        `Failed to connect to resolved IP for ${hostname}: unknown network error`
      )
    }
    if (!isRedirect(response.status)) {
      return response
    }

    releaseResponseBody(response)

    if (!followRedirects) {
      throw new Error("Redirects are not permitted.")
    }

    if (redirects === MAX_REDIRECTS) {
      break
    }

    const location = response.headers.get("location")
    if (!location) {
      if (returnRedirectWithoutLocation) {
        return response
      }
      throw new Error("Maximum redirect reached.")
    }

    const redirectUrl = parseUrl(
      new URL(location, nextUrl).toString()
    ).toString()
    nextRequest = nextRequestForRedirect(nextRequest, response.status)
    if (shouldStripSensitiveHeadersForRedirect(nextUrl, redirectUrl)) {
      nextRequest = stripSensitiveHeadersForRedirect(nextRequest)
    }
    nextUrl = redirectUrl
  }

  throw new Error("Maximum redirect reached.")
}

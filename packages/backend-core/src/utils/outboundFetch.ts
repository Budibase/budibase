import { isBlacklisted } from "../blacklist"
import fetch, { Headers, RequestInit, Response } from "node-fetch"

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

async function throwIfUnsafe(url: string): Promise<void> {
  const parsed = parseUrl(url)
  if (await isBlacklisted(parsed.hostname)) {
    throw new Error("URL is blocked or could not be resolved safely.")
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

function shouldStripSensitiveHeadersForRedirect(
  currentUrl: string,
  redirectUrl: string
): boolean {
  return new URL(currentUrl).origin !== new URL(redirectUrl).origin
}

function stripSensitiveHeadersForRedirect(
  request: RedirectSafeRequest
): RedirectSafeRequest {
  if (!request.headers) {
    return request
  }
  const headers = new Headers(request.headers)
  SENSITIVE_REDIRECT_HEADERS.forEach(header => headers.delete(header))
  return {
    ...request,
    headers,
  }
}

interface RedirectSafeRequest extends RequestInit {
  redirect: "manual"
}

function releaseResponseBody(response: Response) {
  response.body?.resume()
}

export async function fetchWithBlacklist(
  url: string,
  request: RequestInit = {}
): Promise<Response> {
  let nextUrl = url
  let nextRequest: RedirectSafeRequest = {
    ...request,
    redirect: "manual",
  }

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    await throwIfUnsafe(nextUrl)
    const response = await fetch(nextUrl, nextRequest)
    if (!isRedirect(response.status)) {
      return response
    }

    if (redirects === MAX_REDIRECTS) {
      releaseResponseBody(response)
      break
    }

    const location = response.headers.get("location")
    if (!location) {
      return response
    }

    releaseResponseBody(response)

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

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
    await throwIfUnsafe(nextUrl)
    const response = await fetchFn(nextUrl, nextRequest)
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

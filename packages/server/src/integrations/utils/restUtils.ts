import type {
  Headers as UndiciHeaders,
  FormData as UndiciFormData,
} from "undici"
import type { Headers as NodeFetchHeaders } from "node-fetch"
import { JSONValue, RestAuthType, SecretTag } from "@budibase/types"
import { findHBSBlocks } from "@budibase/string-templates"

// Sensitive Header
const SENSITIVE_HEADERS = [
  "authorization",
  "proxy-authorization",
  "cookie",
  "x-api-key",
  "api-key",
]

export function tagForAuthType(authType?: string): string {
  switch (authType) {
    case RestAuthType.BASIC:
      return SecretTag.BASIC
    case RestAuthType.BEARER:
      return SecretTag.BEARER
    case RestAuthType.OAUTH2:
      return SecretTag.OAUTH2
    case "apiKey":
      return SecretTag.API_KEY
    default:
      return SecretTag.GENERIC
  }
}

// Retains an auth scheme prefix such as "Bearer" - it aids debugging and is
// not itself sensitive - while replacing the credential which follows it.
function redactValue(value: string, tag: string): string {
  const [scheme, ...rest] = value.split(" ")
  if (rest.length && /^[a-zA-Z]+$/.test(scheme)) {
    return `${scheme} ${tag}`
  }
  return tag
}

export function normaliseHeaders(headers: unknown): Record<string, string> {
  if (!headers) {
    return {}
  }
  if (typeof (headers as UndiciHeaders).entries === "function") {
    return Object.fromEntries((headers as UndiciHeaders).entries())
  }
  return { ...(headers as Record<string, string>) }
}

export function sanitiseHeaders({
  headers,
  authHeaderKeys = [],
  authType,
}: {
  headers: unknown
  authHeaderKeys?: string[]
  authType?: string
}): Record<string, string> {
  const authKeys = new Set(authHeaderKeys.map(key => key.toLowerCase()))
  const sanitised: Record<string, string> = {}
  for (const [key, value] of Object.entries(normaliseHeaders(headers))) {
    const lowerKey = key.toLowerCase()
    const tag = authKeys.has(lowerKey)
      ? tagForAuthType(authType)
      : SENSITIVE_HEADERS.includes(lowerKey)
        ? SecretTag.GENERIC
        : undefined
    const symbolic = findHBSBlocks(value).length > 0
    sanitised[key] = tag && !symbolic ? redactValue(value, tag) : value
  }
  return sanitised
}

// For serialised JSON
function parseIfJson(value: string): JSONValue {
  try {
    const parsed = JSON.parse(value)
    if (parsed && typeof parsed === "object") {
      return parsed as JSONValue
    }
  } catch {
    // not JSON, show it as it was sent
  }
  return value
}

export function sanitiseBody(body: unknown): JSONValue | undefined {
  if (body == null) {
    return undefined
  }
  if (typeof body === "string") {
    return parseIfJson(body)
  }
  // URLSearchParams and FormData bodies both expose entries()
  if (typeof (body as URLSearchParams).entries === "function") {
    const output: Record<string, JSONValue> = {}
    const iterable = body as URLSearchParams | UndiciFormData
    for (const [key, value] of iterable.entries()) {
      output[key] = typeof value === "string" ? value : `<file: ${key}>`
    }
    return output
  }
  return undefined
}

export function getAttachmentHeaders(
  headers: UndiciHeaders | NodeFetchHeaders,
  opts?: { downloadImages?: boolean }
) {
  const contentType = headers.get("content-type") || ""
  let contentDisposition = headers.get("content-disposition") || ""

  // the API does not follow the requirements of https://www.ietf.org/rfc/rfc2183.txt
  // all content-disposition headers should be format disposition-type; parameters
  // but some APIs do not provide a type, causing the parse below to fail - add one to fix this
  if (contentDisposition) {
    const tokenRegex = /"(?:[^"\\]|\\.)*"|[;=]/g
    // Example match: parses "filename=\"report.pdf\"; size=123" into the quoted filename token and the ; or = separators
    let match: RegExpMatchArray | null = null
    let hasSeparator = false
    let hasParameters = false

    while ((match = tokenRegex.exec(contentDisposition)) !== null) {
      if (match[0] === ";") {
        hasSeparator = true
        break
      }
      if (match[0] === "=") {
        hasParameters = true
      }
    }

    if (!hasSeparator && hasParameters) {
      return {
        contentDisposition: `attachment; ${contentDisposition}`,
        contentType,
      }
    }
  }
  // for images which don't supply a content disposition, make one up, as binary
  // data for images in REST responses isn't really useful, we should always download them
  else if (opts?.downloadImages && contentType.startsWith("image/")) {
    const format = contentType.split("/")[1]
    return {
      contentDisposition: `attachment; filename="image.${format}"`,
      contentType,
    }
  }

  return { contentDisposition, contentType }
}

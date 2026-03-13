import { constants as proConstants, licensing } from "@budibase/pro"
import { constants, context, HTTPError, sql } from "@budibase/backend-core"
import type {
  AgentLogEntry,
  AgentLogEnvironment,
  AgentLogRequestDetail,
  AgentLogSession,
  AgentLogSessionIndexDoc,
  LiteLLMRequestDetail,
} from "@budibase/types"
import {
  ConstantQuotaName,
  DocumentType,
  SEPARATOR,
  SqlClient,
} from "@budibase/types"

export const DEFAULT_SESSION_PAGE_SIZE = 75
export const MAX_SESSION_PAGE_SIZE = 100
export const DEFAULT_BOOKMARK_PAGE = 1
export const EXPIRED_LIMIT = 100
export const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24
export const MAX_SESSION_SCAN_LIMIT = 5000
export const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/
export const builder = new sql.Sql(SqlClient.SQL_LITE)

export async function oldestLogDate() {
  const license = await licensing.cache.getCachedLicense()
  const retentionDays =
    license.quotas?.constant?.[ConstantQuotaName.AGENT_LOG_RETENTION_DAYS]
      ?.value

  if (
    retentionDays === proConstants.licenses.UNLIMITED ||
    retentionDays == null ||
    !Number.isFinite(retentionDays) ||
    retentionDays <= 0
  ) {
    return constants.MIN_VALID_DATE.toISOString()
  }

  return new Date(
    new Date().getTime() - ONE_DAY_MILLIS * retentionDays
  ).toISOString()
}

export function getExpectedEndUser(agentId: string): string {
  return `bb-agent:${agentId}`
}

export function toContentString(content: unknown): string {
  if (typeof content === "string") {
    return content
  }
  if (content == null) {
    return ""
  }
  try {
    return JSON.stringify(content)
  } catch {
    return String(content)
  }
}

export function extractError(
  data: LiteLLMRequestDetail
): AgentLogRequestDetail["error"] | undefined {
  const errorInfo =
    data.metadata?.error_information ||
    data.proxy_server_request?.metadata?.error_information
  const message = errorInfo?.error_message?.trim()
  if (!message) {
    return undefined
  }

  return {
    message,
    code: errorInfo?.error_code,
    errorClass: errorInfo?.error_class,
    provider: errorInfo?.llm_provider,
    traceback: errorInfo?.traceback,
  }
}

export function determineTrigger(sessionId: string): string {
  if (isPreviewSession(sessionId)) {
    return "Chat Preview"
  }

  if (sessionId.startsWith("slack:")) {
    return "Slack"
  }

  if (sessionId.startsWith("msteams:")) {
    return "Microsoft Teams"
  }

  if (sessionId.startsWith("discord:")) {
    return "Discord"
  }

  if (sessionId.startsWith("chat:") || sessionId.startsWith("chatconvo_")) {
    return "Chat"
  }

  return "Automation"
}

export function isPreviewSession(sessionId: string): boolean {
  return sessionId.startsWith("chat-preview:")
}

export function determineStatus(
  entries: AgentLogEntry[]
): AgentLogSession["status"] {
  return entries.some(entry => entry.status === "error") ? "error" : "success"
}

export function parseDate(value?: string): Date | undefined {
  if (!value) {
    return undefined
  }

  const parsedDate = new Date(value)
  if (!Number.isFinite(parsedDate.getTime())) {
    return undefined
  }

  return parsedDate
}

export function parseDateOrThrow(value: string, label: string): string {
  const parsedDate = parseDate(value)
  if (!parsedDate) {
    throw new Error(`Invalid ${label}: ${value}`)
  }
  return parsedDate.toISOString()
}

export function minDate(a?: string, b?: string): string {
  const firstDate = parseDate(a)
  const secondDate = parseDate(b)
  if (!firstDate && !secondDate) {
    throw new Error(
      `Expected at least one valid date, received '${a}' and '${b}'`
    )
  }
  if (!firstDate) return secondDate!.toISOString()
  if (!secondDate) return firstDate.toISOString()

  return firstDate <= secondDate
    ? firstDate.toISOString()
    : secondDate.toISOString()
}

export function maxDate(a?: string, b?: string): string {
  const firstDate = parseDate(a)
  const secondDate = parseDate(b)
  if (!firstDate && !secondDate) {
    throw new Error(
      `Expected at least one valid date, received '${a}' and '${b}'`
    )
  }
  if (!firstDate) return secondDate!.toISOString()
  if (!secondDate) return firstDate.toISOString()

  return firstDate >= secondDate
    ? firstDate.toISOString()
    : secondDate.toISOString()
}

export function truncateText(value: string, maxLength = 100): string {
  if (value.length <= maxLength) {
    return value
  }
  return `${value.slice(0, maxLength)}...`
}

export function parseBookmarkPage(bookmark?: string): number {
  if (!bookmark) {
    return DEFAULT_BOOKMARK_PAGE
  }
  if (!/^\d+$/.test(bookmark)) {
    throw new HTTPError("Invalid bookmark query", 400)
  }

  const parsedBookmark = Number.parseInt(bookmark, 10)
  if (!Number.isFinite(parsedBookmark) || parsedBookmark < 1) {
    throw new HTTPError("Invalid bookmark query", 400)
  }

  return parsedBookmark
}

export function normalizeSessionLimit(limit?: number): number {
  if (!limit || limit <= 0) {
    return DEFAULT_SESSION_PAGE_SIZE
  }

  return Math.min(limit, MAX_SESSION_PAGE_SIZE)
}

export function getMergedSessionLimit(page: number, pageSize: number): number {
  const mergedLimit = (page - 1) * pageSize + pageSize + 1
  if (mergedLimit > MAX_SESSION_SCAN_LIMIT) {
    throw new HTTPError(
      `Bookmark query exceeds maximum scan window of ${MAX_SESSION_SCAN_LIMIT} sessions`,
      400
    )
  }

  return mergedLimit
}

export function mapRequestModel(data: LiteLLMRequestDetail) {
  return (
    data.response?.model || data.model || data.proxy_server_request?.model || ""
  )
}

function getDateBoundary(
  value: string,
  mode: "start" | "end"
): Date | undefined {
  if (DATE_ONLY_REGEX.test(value)) {
    return new Date(
      `${value}T${mode === "start" ? "00:00:00.000" : "23:59:59.999"}Z`
    )
  }

  return parseDate(value)
}

export function getDateBoundaryISO(value: string, mode: "start" | "end") {
  return (
    getDateBoundary(value, mode)?.toISOString() ||
    (mode === "start"
      ? constants.MIN_VALID_DATE.toISOString()
      : constants.MAX_VALID_DATE.toISOString())
  )
}

export function clampStartDate(
  startDate: string,
  maxStartDate: string
): string {
  const normalizedStartDate = getDateBoundaryISO(startDate, "start")
  if (normalizedStartDate < maxStartDate) {
    return maxStartDate
  }
  return normalizedStartDate
}

function encodeKeyPart(value: string): string {
  return encodeURIComponent(value)
}

export function getSessionDocId(agentId: string, sessionId: string): string {
  const encodedAgentId = encodeKeyPart(agentId)
  const encodedSessionId = encodeKeyPart(sessionId)
  return `${DocumentType.AGENT_LOG_SESSION}${SEPARATOR}${encodedAgentId}${SEPARATOR}${encodedSessionId}`
}

export function parseIndexedRequestIds(value?: string): Set<string> {
  if (!value) {
    return new Set()
  }

  const parsed = JSON.parse(value)
  if (!Array.isArray(parsed)) {
    throw new Error("Expected indexed request IDs to be an array")
  }
  if (parsed.some(item => typeof item !== "string")) {
    throw new Error("Expected indexed request IDs to contain only strings")
  }

  return new Set(parsed)
}

export function getWorkspaceDbForEnvironment(environment: AgentLogEnvironment) {
  if (environment === "development") {
    return context.getDevWorkspaceDB()
  }
  if (environment === "production") {
    return context.getProdWorkspaceDB()
  }

  throw new HTTPError("Invalid environment query", 400)
}

export function getLiteLLMRequestUser(
  data: LiteLLMRequestDetail | AgentLogSessionIndexDoc
): string | undefined {
  if ("proxy_server_request" in data || "end_user" in data || "user" in data) {
    return data.proxy_server_request?.user || data.end_user || data.user
  }
  return undefined
}

export function validateLiteLLMRequestOwnership(
  agentId: string,
  data: LiteLLMRequestDetail
) {
  if (getLiteLLMRequestUser(data) !== getExpectedEndUser(agentId)) {
    throw new HTTPError("Agent log detail not found", 404)
  }
}

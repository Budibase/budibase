import type {
  AgentLogEntry,
  AgentLogEnvironment,
  AgentLogRequestDetail,
  AgentLogSession,
  AgentLogSessionIndexDoc,
  AgentLogSessionSnapshot,
  CreateSessionLogIndexerInput,
  Document,
  EnrichedQueryJson,
  FetchAgentLogsResponse,
  IndexAgentLogOperationInput,
  LiteLLMRequestDetail,
  LiteLLMRequestListResponse,
  LiteLLMRequestPayload,
  LiteLLMRequestRecord,
  SearchFilters,
  SessionLogIndexer,
  Table,
} from "@budibase/types"
import { constants as proConstants, licensing } from "@budibase/pro"
import {
  constants,
  context,
  HTTPError,
  queue,
  sql,
  SQS_DATASOURCE_INTERNAL,
} from "@budibase/backend-core"
import {
  ConstantQuotaName,
  DocumentType,
  FieldType,
  Operation,
  SEPARATOR,
  SortOrder,
  SortType,
  SqlClient,
  TableSourceType,
} from "@budibase/types"
export type {
  CreateSessionLogIndexerInput,
  IndexAgentLogOperationInput,
  SessionLogIndexer,
} from "@budibase/types"
import fetch from "node-fetch"
import env from "../../../environment"
import { getAvailableTools, getOrThrow, getToolDisplayNames } from "./agents"
import * as tableSqs from "../tables/internal/sqs"
import { AGENT_LOG_SESSION_TABLE_ID } from "../sqs/staticTables"

const liteLLMUrl = env.LITELLM_URL
const liteLLMAuthorizationHeader = `Bearer ${env.LITELLM_MASTER_KEY}`
const DEFAULT_SESSION_PAGE_SIZE = 75
const MAX_SESSION_PAGE_SIZE = 100
const DEFAULT_BOOKMARK_PAGE = 1
const EXPIRED_LIMIT = 100
const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24
const MAX_SESSION_SCAN_LIMIT = 5000
const builder = new sql.Sql(SqlClient.SQL_LITE)
const DEFAULT_INDEX_QUEUE_CONCURRENCY = 2
const DEFAULT_INDEX_QUEUE_BACKOFF_MS = 5000
const DEFAULT_INDEX_QUEUE_TIMEOUT_MS = 30000
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/

interface AgentLogIndexJob extends IndexAgentLogOperationInput {
  workspaceId: string
}

let agentLogIndexQueue: queue.BudibaseQueue<AgentLogIndexJob> | undefined
let agentLogIndexQueueInitialised = false

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

function getExpectedEndUser(agentId: string): string {
  return `bb-agent:${agentId}`
}

function toContentString(content: unknown): string {
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

function extractError(
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

function determineTrigger(sessionId: string): string {
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

function isPreviewSession(sessionId: string): boolean {
  return sessionId.startsWith("chat-preview:")
}

function determineStatus(entries: AgentLogEntry[]): AgentLogSession["status"] {
  return entries.some(entry => entry.status === "error") ? "error" : "success"
}

function parseDate(value?: string): Date | undefined {
  if (!value) {
    return undefined
  }

  const parsedDate = new Date(value)
  if (!Number.isFinite(parsedDate.getTime())) {
    return undefined
  }

  return parsedDate
}

function parseDateOrThrow(value: string, label: string): string {
  const parsedDate = parseDate(value)
  if (!parsedDate) {
    throw new Error(`Invalid ${label}: ${value}`)
  }
  return parsedDate.toISOString()
}

function minDate(a?: string, b?: string): string {
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

function maxDate(a?: string, b?: string): string {
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

function truncateText(value: string, maxLength = 100): string {
  if (value.length <= maxLength) {
    return value
  }
  return `${value.slice(0, maxLength)}...`
}

function parseBookmarkPage(bookmark?: string): number {
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

function normalizeSessionLimit(limit?: number): number {
  if (!limit || limit <= 0) {
    return DEFAULT_SESSION_PAGE_SIZE
  }

  return Math.min(limit, MAX_SESSION_PAGE_SIZE)
}

function getMergedSessionLimit(page: number, pageSize: number): number {
  const mergedLimit = (page - 1) * pageSize + pageSize + 1
  if (mergedLimit > MAX_SESSION_SCAN_LIMIT) {
    throw new HTTPError(
      `Bookmark query exceeds maximum scan window of ${MAX_SESSION_SCAN_LIMIT} sessions`,
      400
    )
  }

  return mergedLimit
}

function mapRequestModel(data: LiteLLMRequestDetail) {
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

function getDateBoundaryISO(value: string, mode: "start" | "end"): string {
  return (
    getDateBoundary(value, mode)?.toISOString() ||
    (mode === "start"
      ? constants.MIN_VALID_DATE.toISOString()
      : constants.MAX_VALID_DATE.toISOString())
  )
}

function clampStartDate(startDate: string, maxStartDate: string): string {
  const normalizedStartDate = getDateBoundaryISO(startDate, "start")
  if (normalizedStartDate < maxStartDate) {
    return maxStartDate
  }
  return normalizedStartDate
}

function encodeKeyPart(value: string): string {
  return encodeURIComponent(value)
}

function getSessionDocId(agentId: string, sessionId: string): string {
  const encodedAgentId = encodeKeyPart(agentId)
  const encodedSessionId = encodeKeyPart(sessionId)
  return `${DocumentType.AGENT_LOG_SESSION}${SEPARATOR}${encodedAgentId}${SEPARATOR}${encodedSessionId}`
}

function parseIndexedRequestIds(value?: string): Set<string> {
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

function agentLogSessionTable(): Table {
  return {
    type: "table",
    sourceType: TableSourceType.INTERNAL,
    name: AGENT_LOG_SESSION_TABLE_ID,
    sourceId: SQS_DATASOURCE_INTERNAL,
    primary: ["_id"],
    schema: {
      firstInput: {
        name: "firstInput",
        type: FieldType.STRING,
      },
      requestIds: {
        name: "requestIds",
        type: FieldType.STRING,
      },
    },
  }
}

async function querySql<T extends Document>(
  request: EnrichedQueryJson,
  table: Table,
  db = context.getWorkspaceDB()
): Promise<T[]> {
  await tableSqs.ensureStaticTables(db)

  const query = builder._query(request)
  if (Array.isArray(query)) {
    throw new Error("Cannot execute multiple queries for agent log search")
  }

  const rows = await db.sql<T>(query.sql, query.bindings)
  return builder.convertJsonStringColumns(
    table,
    rows as Array<T & Record<string, unknown>>
  ) as T[]
}

export async function getExpiredSessions(): Promise<AgentLogSessionIndexDoc[]> {
  const expiredEnd = await oldestLogDate()
  const sessionTable = agentLogSessionTable()

  return await querySql<AgentLogSessionIndexDoc>(
    {
      operation: Operation.READ,
      table: sessionTable,
      tables: {},
      paginate: {
        page: DEFAULT_BOOKMARK_PAGE,
        limit: EXPIRED_LIMIT,
      },
      filters: {
        range: {
          lastActivityAt: {
            high: expiredEnd,
          },
        },
      },
      resource: {
        fields: [],
      },
      sort: {
        lastActivityAt: {
          direction: SortOrder.ASCENDING,
          type: SortType.STRING,
        },
      },
    },
    sessionTable
  )
}

export async function clearOldHistory(): Promise<void> {
  const db = context.getWorkspaceDB()

  try {
    const expiredEnd = await oldestLogDate()
    const expiredSessions = await getExpiredSessions()
    if (!expiredSessions.length) {
      return
    }

    const docs = await db.getMultiple<AgentLogSessionIndexDoc>(
      expiredSessions.map(session => session._id),
      { allowMissing: true }
    )
    const toDelete = docs
      .filter(
        doc =>
          !!doc?._id &&
          !!doc?._rev &&
          new Date(doc.lastActivityAt).getTime() <=
            new Date(expiredEnd).getTime()
      )
      .map(doc => ({
        _id: doc._id!,
        _rev: doc._rev!,
        _deleted: true,
      }))

    if (!toDelete.length) {
      return
    }

    await db.bulkDocs(toDelete)
  } catch (error) {
    console.log("Failed to cleanup agent log history", error)
  }
}

function buildSessionFilters(
  agentId: string,
  startDate: string,
  endDate: string,
  statusFilter?: string,
  triggerFilter?: string
): SearchFilters {
  const oneOf: NonNullable<SearchFilters["oneOf"]> = {
    agentId: [agentId],
  }
  if (statusFilter && statusFilter !== "all") {
    oneOf.status = [statusFilter]
  }
  if (triggerFilter && triggerFilter !== "all") {
    oneOf.trigger = [triggerFilter]
  }

  const filter: SearchFilters = {
    oneOf,
    range: {
      lastActivityAt: {
        low: getDateBoundaryISO(startDate, "start"),
        high: getDateBoundaryISO(endDate, "end"),
      },
    },
  }

  return filter
}

function getWorkspaceDbForEnvironment(environment: AgentLogEnvironment) {
  if (environment === "development") {
    return context.getDevWorkspaceDB()
  }
  if (environment === "production") {
    return context.getProdWorkspaceDB()
  }

  throw new HTTPError("Invalid environment query", 400)
}

function getLiteLLMRequestUser(data: LiteLLMRequestDetail): string | undefined {
  return data.proxy_server_request?.user || data.end_user || data.user
}

function validateLiteLLMRequestOwnership(
  agentId: string,
  data: LiteLLMRequestDetail
) {
  if (getLiteLLMRequestUser(data) !== getExpectedEndUser(agentId)) {
    throw new HTTPError("Agent log detail not found", 404)
  }
}

function formatLiteLLMDateTime(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0")
  return (
    [
      date.getUTCFullYear(),
      pad(date.getUTCMonth() + 1),
      pad(date.getUTCDate()),
    ].join("-") +
    ` ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
      date.getUTCSeconds()
    )}`
  )
}

function getLiteLLMDayBoundary(value: string, mode: "start" | "end"): string {
  const parsedDate = parseDate(value)
  if (!parsedDate) {
    throw new Error(`Invalid LiteLLM date: ${value}`)
  }

  const boundary = new Date(parsedDate)
  if (mode === "start") {
    boundary.setUTCHours(0, 0, 0, 0)
  } else {
    boundary.setUTCHours(23, 59, 59, 999)
  }

  return formatLiteLLMDateTime(boundary)
}

async function fetchLiteLLMRequestSummaryById(
  requestId: string,
  startDate?: string,
  endDate?: string
): Promise<LiteLLMRequestDetail | null> {
  const params = new URLSearchParams({
    request_id: requestId,
    start_date: getLiteLLMDayBoundary(
      startDate || constants.MIN_VALID_DATE.toISOString(),
      "start"
    ),
    end_date: getLiteLLMDayBoundary(
      endDate || constants.MAX_VALID_DATE.toISOString(),
      "end"
    ),
    page: "1",
    page_size: "1",
  })
  const response = await fetch(
    `${liteLLMUrl}/spend/logs/v2?${params.toString()}`,
    {
      headers: {
        Authorization: liteLLMAuthorizationHeader,
      },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    const text = await response.text()
    throw new Error(
      `Error fetching agent log detail: ${text || response.statusText}`
    )
  }

  const data = (await response.json()) as LiteLLMRequestListResponse | null
  return data?.data?.[0] || null
}

async function fetchLiteLLMSessionRows(
  sessionId: string
): Promise<{ rows: LiteLLMRequestRecord[]; total: number }> {
  const pageSize = 100
  const rows: LiteLLMRequestRecord[] = []
  let page = 1
  let total = 0
  let totalPages = 1

  while (page <= totalPages) {
    const params = new URLSearchParams({
      session_id: sessionId,
      page: String(page),
      page_size: String(pageSize),
    })
    const response = await fetch(
      `${liteLLMUrl}/spend/logs/session/ui?${params.toString()}`,
      {
        headers: {
          Authorization: liteLLMAuthorizationHeader,
        },
      }
    )

    if (response.status === 404) {
      return { rows: [], total: 0 }
    }

    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `Error fetching agent session detail: ${text || response.statusText}`
      )
    }

    const data = (await response.json()) as LiteLLMRequestListResponse
    rows.push(...(data.data || []))
    total = data.total || total || rows.length
    totalPages = data.total_pages || 1
    page += 1
  }

  return { rows, total }
}

async function fetchLiteLLMRequestPayloadById(
  requestId: string
): Promise<LiteLLMRequestPayload | null> {
  const response = await fetch(
    `${liteLLMUrl}/spend/logs/ui/${encodeURIComponent(requestId)}`,
    {
      headers: {
        Authorization: liteLLMAuthorizationHeader,
      },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    const text = await response.text()
    throw new Error(
      `Error fetching agent log detail: ${text || response.statusText}`
    )
  }

  return (await response.json()) as LiteLLMRequestPayload
}

async function fetchLiteLLMRequestRaw(
  agentId: string,
  requestId: string
): Promise<LiteLLMRequestDetail> {
  const [payload, summary] = await Promise.all([
    fetchLiteLLMRequestPayloadById(requestId),
    fetchLiteLLMRequestSummaryById(requestId),
  ])

  if (!payload) {
    throw new HTTPError("Agent log detail not found", 404)
  }
  const data: LiteLLMRequestDetail = {
    request_id: requestId,
    model: summary?.model,
    prompt_tokens: summary?.prompt_tokens,
    completion_tokens: summary?.completion_tokens,
    spend: summary?.spend,
    status: summary?.status,
    startTime: summary?.startTime,
    endTime: summary?.endTime,
    end_user: summary?.end_user,
    user: summary?.user,
    metadata: summary?.metadata,
    response: payload.response,
    proxy_server_request: payload.proxy_server_request,
  }

  validateLiteLLMRequestOwnership(agentId, data)

  return data
}

async function upsertSessionIndexDoc(
  db: ReturnType<typeof context.getWorkspaceDB>,
  snapshot: AgentLogSessionSnapshot
): Promise<void> {
  const sessionDocId = getSessionDocId(snapshot.agentId, snapshot.sessionId)
  const now = new Date().toISOString()

  for (let attempt = 0; attempt < 3; attempt++) {
    const existing = await db.tryGet<AgentLogSessionIndexDoc>(sessionDocId)
    const requestIds = parseIndexedRequestIds(existing?.requestIds)
    for (const requestId of snapshot.requestIds) {
      requestIds.add(requestId)
    }
    const startTime = existing
      ? minDate(existing.startTime, snapshot.startTime)
      : snapshot.startTime
    const lastActivityAt = existing
      ? maxDate(existing.lastActivityAt, snapshot.endTime || snapshot.startTime)
      : snapshot.endTime || snapshot.startTime
    const status =
      existing?.status === "error" || snapshot.status === "error"
        ? "error"
        : "success"

    const doc: AgentLogSessionIndexDoc = {
      ...(existing ? { _rev: existing._rev } : {}),
      _id: sessionDocId,
      tableId: AGENT_LOG_SESSION_TABLE_ID,
      type: "agent_log_session",
      agentId: snapshot.agentId,
      sessionId: snapshot.sessionId,
      trigger: existing?.trigger || snapshot.trigger,
      isPreview: existing?.isPreview ?? snapshot.isPreview,
      firstInput: existing?.firstInput || snapshot.firstInput,
      startTime,
      lastActivityAt,
      requestIds: JSON.stringify([...requestIds]),
      operations: requestIds.size,
      status,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    try {
      await db.put(doc)
      return
    } catch (error: any) {
      if (error?.status === 409 && attempt < 2) {
        continue
      }
      throw error
    }
  }
}

function getIndexQueue() {
  if (!agentLogIndexQueue) {
    agentLogIndexQueue = new queue.BudibaseQueue<AgentLogIndexJob>(
      queue.JobQueue.AGENT_LOG_INDEXING,
      {
        maxStalledCount: 3,
        jobOptions: {
          attempts: 6,
          backoff: {
            type: "exponential",
            delay: DEFAULT_INDEX_QUEUE_BACKOFF_MS,
          },
          timeout: DEFAULT_INDEX_QUEUE_TIMEOUT_MS,
          removeOnComplete: true,
          removeOnFail: 1000,
        },
        jobTags: data => ({
          workspaceId: data.workspaceId,
          agentId: data.agentId,
          sessionId: data.sessionId,
        }),
      }
    )
  }

  return agentLogIndexQueue
}

export function initLogIndexQueue(
  concurrency = DEFAULT_INDEX_QUEUE_CONCURRENCY
) {
  if (agentLogIndexQueueInitialised) {
    return Promise.resolve()
  }

  try {
    agentLogIndexQueueInitialised = true
    return getIndexQueue().process(concurrency, async job => {
      const { workspaceId, ...indexInput } = job.data
      await context.doInWorkspaceContext(workspaceId, async () => {
        await addSessionLog(indexInput)
      })
    })
  } catch (error) {
    agentLogIndexQueueInitialised = false
    throw error
  }
}

async function enqueueSessionLogIndex(job: AgentLogIndexJob) {
  initLogIndexQueue()
  return await getIndexQueue().add(job)
}

export async function addSessionLog(
  input: IndexAgentLogOperationInput
): Promise<void> {
  const uniqueRequestIds = [...new Set(input.requestIds)].filter(Boolean)
  if (!input.agentId || !input.sessionId || !uniqueRequestIds.length) {
    return
  }

  const db = context.getWorkspaceDB()
  const trigger = determineTrigger(input.sessionId)
  const isPreview = isPreviewSession(input.sessionId)
  const firstInput = truncateText(input.firstInput || "")
  const fallbackStartTime = parseDateOrThrow(input.startedAt, "startedAt")
  const fallbackEndTime = parseDateOrThrow(input.completedAt, "completedAt")

  const summaryResults = await Promise.all(
    uniqueRequestIds.map(async requestId => {
      try {
        const requestDetail = await fetchLiteLLMRequestSummaryById(
          requestId,
          fallbackStartTime,
          fallbackEndTime
        )
        if (!requestDetail) {
          return null
        }
        validateLiteLLMRequestOwnership(input.agentId, requestDetail)
        return {
          requestId,
          detail: requestDetail,
        }
      } catch {
        return null
      }
    })
  )
  const summaries = summaryResults.filter(
    (
      result
    ): result is {
      requestId: string
      detail: LiteLLMRequestDetail
    } => result != null
  )

  const foundRequestIds = new Set(summaries.map(summary => summary.requestId))
  const missingRequestIds = uniqueRequestIds.filter(
    requestId => !foundRequestIds.has(requestId)
  )

  if (!summaries.length) {
    const error: any = new HTTPError("Agent log details not ready", 404)
    error.missingRequestIds = uniqueRequestIds
    throw error
  }

  const snapshot: AgentLogSessionSnapshot = {
    agentId: input.agentId,
    sessionId: input.sessionId,
    requestIds: summaries.map(summary => summary.requestId),
    trigger,
    isPreview,
    firstInput,
    startTime: summaries.reduce(
      (earliest, summary) => minDate(earliest, summary.detail.startTime),
      fallbackStartTime
    ),
    endTime: summaries.reduce(
      (latest, summary) => maxDate(latest, summary.detail.endTime),
      fallbackEndTime
    ),
    status: summaries.some(summary => summary.detail.status === "failure")
      ? "error"
      : "success",
  }
  await upsertSessionIndexDoc(db, snapshot)

  if (missingRequestIds.length) {
    const error: any = new HTTPError("Agent log details not ready", 404)
    error.missingRequestIds = missingRequestIds
    throw error
  }
  await clearOldHistory()
}

export function createSessionLogIndexer({
  agentId,
  sessionId,
  firstInput,
  errorLabel,
  startedAt = new Date().toISOString(),
}: CreateSessionLogIndexerInput): SessionLogIndexer {
  const requestIds = new Set<string>()

  return {
    addRequestId(requestId) {
      if (requestId) {
        requestIds.add(requestId)
      }
    },
    async index() {
      if (!requestIds.size) {
        return
      }

      const workspaceId = context.getWorkspaceId()
      if (!workspaceId) {
        console.error(`Failed to queue ${errorLabel} logs`, {
          agentId,
          sessionId,
          error: new Error("workspaceId is required"),
        })
        return
      }

      try {
        await enqueueSessionLogIndex({
          workspaceId,
          agentId,
          sessionId,
          requestIds: [...requestIds],
          firstInput,
          startedAt,
          completedAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error(`Failed to queue ${errorLabel} logs`, {
          agentId,
          sessionId,
          error,
        })
      }
    },
  }
}

export async function fetchSessions(
  agentId: string,
  startDate: string,
  endDate: string,
  bookmark?: string,
  limit?: number,
  statusFilter?: string,
  triggerFilter?: string
): Promise<FetchAgentLogsResponse> {
  const page = parseBookmarkPage(bookmark)
  const pageSize = normalizeSessionLimit(limit)
  const pageStart = (page - 1) * pageSize
  const mergedLimit = getMergedSessionLimit(page, pageSize)
  const sessionTable = agentLogSessionTable()
  const maxStartDate = await oldestLogDate()
  const clampedStartDate = clampStartDate(startDate, maxStartDate)

  await clearOldHistory()

  const query = {
    operation: Operation.READ,
    table: sessionTable,
    tables: {},
    paginate: {
      page: 1,
      limit: mergedLimit,
    },
    filters: buildSessionFilters(
      agentId,
      clampedStartDate,
      endDate,
      statusFilter,
      triggerFilter
    ),
    resource: {
      fields: [],
    },
    sort: {
      lastActivityAt: {
        direction: SortOrder.DESCENDING,
        type: SortType.STRING,
      },
    },
  } satisfies EnrichedQueryJson

  const [developmentRows, productionRows] = await Promise.all([
    querySql<AgentLogSessionIndexDoc>(
      query,
      sessionTable,
      context.getDevWorkspaceDB()
    ),
    querySql<AgentLogSessionIndexDoc>(
      query,
      sessionTable,
      context.getProdWorkspaceDB()
    ),
  ])

  const rows = [
    ...developmentRows.map(session => ({
      session,
      environment: "development" as const,
    })),
    ...productionRows.map(session => ({
      session,
      environment: "production" as const,
    })),
  ]
    .sort((a, b) => {
      const aTime = new Date(a.session.lastActivityAt || 0).getTime()
      const bTime = new Date(b.session.lastActivityAt || 0).getTime()
      return bTime - aTime
    })
    .filter(
      (item, index, items) =>
        items.findIndex(
          other =>
            other.environment === item.environment &&
            other.session.sessionId === item.session.sessionId
        ) === index
    )

  const pagedRows = rows.slice(pageStart, pageStart + pageSize + 1)
  const hasMore = pagedRows.length > pageSize
  if (hasMore) {
    pagedRows.pop()
  }

  const sessions = pagedRows.map(
    ({ session, environment }) =>
      ({
        sessionId: session.sessionId,
        environment,
        firstInput: session.firstInput || "",
        trigger: session.trigger,
        isPreview: !!session.isPreview,
        startTime: session.startTime,
        operations: session.operations || 0,
        status: session.status,
        entries: [],
      }) satisfies AgentLogSession
  )

  return {
    sessions,
    hasMore,
    nextBookmark: hasMore ? String(page + 1) : undefined,
  }
}

export async function fetchSessionDetail(
  agentId: string,
  sessionId: string,
  environment: AgentLogEnvironment
): Promise<AgentLogSession | null> {
  const sessionSummaryDb = getWorkspaceDbForEnvironment(environment)
  const { rows: sessionRows, total } = await fetchLiteLLMSessionRows(sessionId)
  const liveEntries = sessionRows
    .filter(row => getLiteLLMRequestUser(row) === getExpectedEndUser(agentId))
    .sort((a, b) => {
      const aTime = new Date(a.startTime || 0).getTime()
      const bTime = new Date(b.startTime || 0).getTime()
      return aTime - bTime
    })
    .map(
      row =>
        ({
          requestId: row.request_id || "",
          sessionId: row.session_id || sessionId,
          model: mapRequestModel(row),
          inputTokens: row.prompt_tokens ?? 0,
          outputTokens: row.completion_tokens ?? 0,
          spend: row.spend ?? 0,
          startTime: row.startTime || "",
          endTime: row.endTime || "",
          status: row.status === "failure" ? "error" : "success",
        }) satisfies AgentLogEntry
    )

  const sessionSummary = await sessionSummaryDb.tryGet<AgentLogSessionIndexDoc>(
    getSessionDocId(agentId, sessionId)
  )

  if (!liveEntries.length) {
    return null
  }

  return {
    sessionId,
    environment,
    firstInput: sessionSummary?.firstInput || "",
    trigger: sessionSummary?.trigger || determineTrigger(sessionId),
    isPreview: sessionSummary?.isPreview ?? isPreviewSession(sessionId),
    startTime: liveEntries[0]?.startTime || sessionSummary?.startTime || "",
    operations: Math.max(
      sessionSummary?.operations || 0,
      total,
      liveEntries.length
    ),
    status: determineStatus(liveEntries),
    entries: liveEntries,
  }
}

export async function fetchRequestDetail(
  agentId: string,
  requestId: string
): Promise<AgentLogRequestDetail> {
  const data = await fetchLiteLLMRequestRaw(agentId, requestId)
  const requestMessages = data.proxy_server_request?.messages || []
  const responseMessage = data.response?.choices?.[0]?.message
  const agent = await getOrThrow(agentId)
  const toolDisplayNames = getToolDisplayNames(
    await getAvailableTools(agent.aiconfig)
  )

  const messages = requestMessages.map(message => ({
    role: message.role,
    content: toContentString(message.content),
  }))

  const responseText = responseMessage
    ? toContentString(responseMessage.content)
    : ""
  const error = extractError(data)

  const inputToolCalls = requestMessages.flatMap(message => {
    if (message.role !== "assistant" || !message.tool_calls?.length) {
      return []
    }
    return message.tool_calls.map(toolCall => ({
      id: toolCall.id,
      name: toolCall.function?.name || "unknown",
      displayName: toolDisplayNames[toolCall.function?.name || ""],
      arguments: toolCall.function?.arguments || "{}",
    }))
  })

  const toolCalls =
    responseMessage?.tool_calls?.map(toolCall => ({
      id: toolCall.id,
      name: toolCall.function?.name || "unknown",
      displayName: toolDisplayNames[toolCall.function?.name || ""],
      arguments: toolCall.function?.arguments || "{}",
    })) || []

  const toolNameById = new Map<string, string>()
  for (const call of [...inputToolCalls, ...toolCalls]) {
    if (call.id) {
      toolNameById.set(call.id, call.name)
    }
  }

  const toolResults = requestMessages.flatMap(message => {
    if (message.role !== "tool") {
      return []
    }
    return [
      {
        toolCallId: message.tool_call_id,
        name: message.tool_call_id
          ? toolNameById.get(message.tool_call_id) || "tool"
          : "tool",
        displayName: message.tool_call_id
          ? toolDisplayNames[toolNameById.get(message.tool_call_id) || ""]
          : undefined,
        content: toContentString(message.content),
      },
    ]
  })

  return {
    requestId: data.request_id || requestId,
    model: mapRequestModel(data) || "unknown",
    messages,
    inputToolCalls,
    response: responseText,
    error,
    toolCalls,
    toolResults,
    inputTokens: data.prompt_tokens || 0,
    outputTokens: data.completion_tokens || 0,
    spend: data.spend || 0,
    startTime: data.startTime || "",
    endTime: data.endTime || "",
  }
}

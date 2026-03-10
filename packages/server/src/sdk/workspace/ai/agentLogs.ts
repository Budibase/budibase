import type {
  AgentLogEntry,
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
import {
  constants,
  context,
  HTTPError,
  queue,
  sql,
  SQS_DATASOURCE_INTERNAL,
} from "@budibase/backend-core"
import {
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
let agentLogIndexQueueInitPromise: Promise<void> | undefined

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

function toISO(value?: string): string {
  return (parseDate(value) || new Date()).toISOString()
}

function minDate(a?: string, b?: string): string {
  const firstDate = parseDate(a)
  const secondDate = parseDate(b)
  if (!firstDate || !secondDate) {
    throw new Error(`Expected valid dates, received '${a}' and '${b}'`)
  }

  return firstDate <= secondDate
    ? firstDate.toISOString()
    : secondDate.toISOString()
}

function maxDate(a?: string, b?: string): string {
  const firstDate = parseDate(a)
  const secondDate = parseDate(b)
  if (!firstDate || !secondDate) {
    throw new Error(`Expected valid dates, received '${a}' and '${b}'`)
  }

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
  const parsed = Number.parseInt(bookmark, 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new HTTPError("Invalid bookmark query", 400)
  }
  return parsed
}

function normalizeSessionLimit(limit?: number): number {
  if (!limit || limit <= 0) {
    return DEFAULT_SESSION_PAGE_SIZE
  }
  return Math.min(limit, MAX_SESSION_PAGE_SIZE)
}

function mapRequestModel(data: LiteLLMRequestDetail) {
  return (
    data.response?.model || data.model || data.proxy_server_request?.model || ""
  )
}

function getDateBoundary(value: string, mode: "start" | "end"): Date | undefined {
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
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) {
      return new Set()
    }
    return new Set(
      parsed.filter((item): item is string => typeof item === "string")
    )
  } catch {
    return new Set()
  }
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
  table: Table
): Promise<T[]> {
  await tableSqs.ensureStaticTables()

  const query = builder._query(request)
  if (Array.isArray(query)) {
    throw new Error("Cannot execute multiple queries for agent log search")
  }

  const rows = await context.getWorkspaceDB().sql<T>(query.sql, query.bindings)
  return builder.convertJsonStringColumns(
    table,
    rows as Array<T & Record<string, unknown>>
  ) as T[]
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

  if (!agentLogIndexQueueInitPromise) {
    agentLogIndexQueueInitPromise = (async () => {
      await getIndexQueue().process(concurrency, async job => {
        const { workspaceId, ...indexInput } = job.data
        await context.doInWorkspaceContext(workspaceId, async () => {
          await addSessionLog(indexInput)
        })
      })
      agentLogIndexQueueInitialised = true
    })()
  }

  return agentLogIndexQueueInitPromise.catch(error => {
    agentLogIndexQueueInitPromise = undefined
    throw error
  })
}

async function enqueueSessionLogIndex(job: AgentLogIndexJob) {
  await initLogIndexQueue()
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
  const fallbackStartTime = toISO(input.startedAt)
  const fallbackEndTime = toISO(input.completedAt || input.startedAt)

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
  const sessionTable = agentLogSessionTable()

  const rows = await querySql<AgentLogSessionIndexDoc>(
    {
      operation: Operation.READ,
      table: sessionTable,
      tables: {},
      paginate: {
        page,
        limit: pageSize + 1,
      },
      filters: buildSessionFilters(
        agentId,
        startDate,
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
    },
    sessionTable
  )

  const hasMore = rows.length > pageSize
  if (hasMore) {
    rows.pop()
  }

  const sessions = rows.map(
    session =>
      ({
        sessionId: session.sessionId,
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
  sessionId: string
): Promise<AgentLogSession | null> {
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

  const sessionSummary = await context
    .getWorkspaceDB()
    .tryGet<AgentLogSessionIndexDoc>(getSessionDocId(agentId, sessionId))

  if (!liveEntries.length) {
    return null
  }

  return {
    sessionId,
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

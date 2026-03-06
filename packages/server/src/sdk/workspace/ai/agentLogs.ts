import type {
  AgentLogEntry,
  AgentLogSession,
  AgentLogRequestDetail,
  FetchAgentLogsResponse,
} from "@budibase/types"
import fetch from "node-fetch"
import env from "../../../environment"
import { getAvailableTools, getOrThrow, getToolDisplayNames } from "./agents"

const liteLLMUrl = env.LITELLM_URL
const liteLLMAuthorizationHeader = `Bearer ${env.LITELLM_MASTER_KEY}`

interface LiteLLMSpendLog {
  request_id: string
  session_id?: string
  end_user?: string
  model?: string
  prompt_tokens?: number
  completion_tokens?: number
  spend?: number
  startTime?: string
  endTime?: string
  status?: string
  session_total_count?: number
  proxy_server_request?: {
    messages?: LiteLLMProxyMessage[]
  }
}

interface LiteLLMToolCall {
  id?: string
  function?: {
    name?: string
    arguments?: string
  }
}

interface LiteLLMProxyMessage {
  role: string
  content?: unknown
  tool_calls?: LiteLLMToolCall[]
  tool_call_id?: string
}

interface LiteLLMRequestDetail {
  request_id?: string
  model?: string
  prompt_tokens?: number
  completion_tokens?: number
  startTime?: string
  endTime?: string
  response?: {
    model?: string
    choices?: Array<{
      message?: {
        content?: unknown
        tool_calls?: LiteLLMToolCall[] | null
      }
    }>
  }
  proxy_server_request?: {
    messages?: LiteLLMProxyMessage[]
  }
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

function determineTrigger(sessionId: string): string {
  if (sessionId.startsWith("chat-preview:")) {
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

  if (sessionId.startsWith("chatconvo_")) {
    return "Chat"
  }
  return "Automation"
}

function determineStatus(entries: AgentLogEntry[]): "success" | "error" {
  return entries.some(e => e.status === "error") ? "error" : "success"
}

function extractFirstInput(logs: LiteLLMSpendLog[]): string {
  for (const log of logs) {
    const messages = log.proxy_server_request?.messages
    if (messages) {
      const userMsg = messages.find(m => m.role === "user")
      const content = toContentString(userMsg?.content)
      if (content) {
        return content.length > 100 ? content.slice(0, 100) + "..." : content
      }
    }
  }
  return ""
}

function formatLiteLLMDateTime(
  value: string,
  mode: "start" | "end" = "start"
): string {
  if (!value) {
    return value
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value} ${mode === "start" ? "00:00:00" : "23:59:59"}`
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value.replace("T", " ").replace("Z", "").split(".")[0]
  }

  const iso = date.toISOString().replace("T", " ")
  return iso.slice(0, 19)
}

function buildSession(sessionId: string, sessionLogs: LiteLLMSpendLog[]) {
  const sorted = sessionLogs.sort(
    (a, b) =>
      new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime()
  )

  const entries: AgentLogEntry[] = sorted.map(log => ({
    requestId: log.request_id,
    sessionId,
    model: log.model || "unknown",
    inputTokens: log.prompt_tokens || 0,
    outputTokens: log.completion_tokens || 0,
    spend: log.spend || 0,
    startTime: log.startTime || "",
    endTime: log.endTime || "",
    status: log.status === "failure" ? "error" : "success",
  }))

  return {
    sessionId,
    firstInput: extractFirstInput(sorted),
    trigger: determineTrigger(sessionId),
    startTime: entries[0]?.startTime || "",
    operations: Math.max(
      entries.length,
      ...sorted.map(log => log.session_total_count || 0)
    ),
    status: determineStatus(entries),
    entries,
  } satisfies AgentLogSession
}

export async function fetchSessions(
  agentId: string,
  startDate: string,
  endDate: string,
  page: number
): Promise<FetchAgentLogsResponse> {
  const apiPage = Math.max(1, page + 1)
  const params = new URLSearchParams({
    end_user: `bb-agent:${agentId}`,
    start_date: formatLiteLLMDateTime(startDate, "start"),
    end_date: formatLiteLLMDateTime(endDate, "end"),
    page: String(apiPage),
    page_size: "100",
    sort_by: "startTime",
    sort_order: "desc",
  })
  const response = await fetch(`${liteLLMUrl}/spend/logs/ui?${params}`, {
    headers: {
      Authorization: liteLLMAuthorizationHeader,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Error fetching agent logs: ${text || response.statusText}`)
  }

  const json = await response.json()
  const logs: LiteLLMSpendLog[] = Array.isArray(json) ? json : json.data || []
  const totalPages: number = json.total_pages || 0

  const sessionMap = new Map<string, LiteLLMSpendLog[]>()
  for (const log of logs) {
    const sessionId = log.session_id || log.request_id
    const existing = sessionMap.get(sessionId) || []
    existing.push(log)
    sessionMap.set(sessionId, existing)
  }

  const sessions: AgentLogSession[] = []
  for (const [sessionId, sessionLogs] of sessionMap) {
    sessions.push(buildSession(sessionId, sessionLogs))
  }

  sessions.sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )

  return {
    sessions,
    currentPage: page,
    hasMore: apiPage < totalPages,
  }
}

export async function fetchSessionDetail(
  agentId: string,
  sessionId: string
): Promise<AgentLogSession | null> {
  const firstPageParams = new URLSearchParams({
    session_id: sessionId,
    page: "1",
    page_size: "100",
  })
  const firstPageResponse = await fetch(
    `${liteLLMUrl}/spend/logs/session/ui?${firstPageParams}`,
    {
      headers: {
        Authorization: liteLLMAuthorizationHeader,
      },
    }
  )

  if (!firstPageResponse.ok) {
    const text = await firstPageResponse.text()
    throw new Error(
      `Error fetching agent session detail: ${text || firstPageResponse.statusText}`
    )
  }

  const firstPageJson = await firstPageResponse.json()
  const logs: LiteLLMSpendLog[] = firstPageJson.data || []
  const totalPages = firstPageJson.total_pages || 0

  for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
    const params = new URLSearchParams({
      session_id: sessionId,
      page: String(currentPage),
      page_size: "100",
    })
    const response = await fetch(`${liteLLMUrl}/spend/logs/session/ui?${params}`, {
      headers: {
        Authorization: liteLLMAuthorizationHeader,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `Error fetching agent session detail: ${text || response.statusText}`
      )
    }

    const json = await response.json()
    logs.push(...(json.data || []))
  }

  const filteredLogs = logs.filter(
    log => !log.end_user || log.end_user === `bb-agent:${agentId}`
  )

  if (!filteredLogs.length) {
    return null
  }

  return buildSession(sessionId, filteredLogs)
}

export async function fetchRequestDetail(
  agentId: string,
  requestId: string,
  startDate: string
): Promise<AgentLogRequestDetail> {
  const params = new URLSearchParams({
    start_date: formatLiteLLMDateTime(startDate, "start"),
  })
  const response = await fetch(
    `${liteLLMUrl}/spend/logs/ui/${requestId}?${params}`,
    {
      headers: {
        Authorization: liteLLMAuthorizationHeader,
      },
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(
      `Error fetching agent log detail: ${text || response.statusText}`
    )
  }

  const data = (await response.json()) as LiteLLMRequestDetail
  const requestMessages = data.proxy_server_request?.messages || []
  const agent = await getOrThrow(agentId)
  const toolDisplayNames = getToolDisplayNames(
    await getAvailableTools(agent.aiconfig)
  )

  const messages = requestMessages.map(m => ({
    role: m.role,
    content: toContentString(m.content),
  }))

  const responseText =
    toContentString(data.response?.choices?.[0]?.message?.content) ||
    JSON.stringify(data.response?.choices?.[0]?.message) ||
    ""

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
    data.response?.choices?.[0]?.message?.tool_calls?.map(toolCall => ({
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
    model: data.response?.model || data.model || "unknown",
    messages,
    inputToolCalls,
    response: responseText,
    toolCalls,
    toolResults,
    inputTokens: data.prompt_tokens || 0,
    outputTokens: data.completion_tokens || 0,
    startTime: data.startTime || "",
    endTime: data.endTime || "",
  }
}

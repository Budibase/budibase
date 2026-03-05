import type {
  AgentLogEntry,
  AgentLogSession,
  AgentLogRequestDetail,
  FetchAgentLogsResponse,
} from "@budibase/types"
import fetch from "node-fetch"
import env from "../../../environment"

const liteLLMUrl = env.LITELLM_URL
const liteLLMAuthorizationHeader = `Bearer ${env.LITELLM_MASTER_KEY}`

interface LiteLLMSpendLog {
  request_id: string
  session_id?: string
  model?: string
  prompt_tokens?: number
  completion_tokens?: number
  spend?: number
  startTime?: string
  endTime?: string
  status?: string
  proxy_server_request?: {
    messages?: Array<{ role: string; content: string }>
  }
}

function determineTrigger(sessionId: string): "Chat" | "Automation" {
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
      if (userMsg?.content) {
        return userMsg.content.length > 100
          ? userMsg.content.slice(0, 100) + "..."
          : userMsg.content
      }
    }
  }
  return ""
}

export async function fetchSessions(
  agentId: string,
  startDate: string,
  endDate: string,
  page: number,
  pageSize: number
): Promise<FetchAgentLogsResponse> {
  const apiPage = Math.max(1, page + 1)
  const apiPageSize = Math.min(100, pageSize)
  const params = new URLSearchParams({
    end_user: `bb-agent:${agentId}`,
    start_date: startDate,
    end_date: endDate,
    page: String(apiPage),
    page_size: String(apiPageSize),
  })
  console.log(params.toString())
  console.log(Object.fromEntries(params.entries()))

  console.log(`${liteLLMUrl}/spend/logs/v2?${params}`)
  const response = await fetch(`${liteLLMUrl}/spend/logs/v2?${params}`, {
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
    const sorted = sessionLogs.sort(
      (a, b) =>
        new Date(a.startTime || 0).getTime() -
        new Date(b.startTime || 0).getTime()
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

    sessions.push({
      sessionId,
      firstInput: extractFirstInput(sorted),
      trigger: determineTrigger(sessionId),
      startTime: entries[0]?.startTime || "",
      operations: entries.length,
      status: determineStatus(entries),
      entries,
    })
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

export async function fetchRequestDetail(
  requestId: string,
  startDate: string
): Promise<AgentLogRequestDetail> {
  const fullStartDate = startDate.includes(" ")
    ? startDate
    : `${startDate} 00:00:00`
  const params = new URLSearchParams({ start_date: fullStartDate })

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

  const data = await response.json()

  const messages =
    data.proxy_server_request?.messages?.map(
      (m: { role: string; content: string }) => ({
        role: m.role,
        content:
          typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      })
    ) || []

  const responseText =
    data.response?.choices?.[0]?.message?.content ||
    JSON.stringify(data.response?.choices?.[0]?.message) ||
    ""

  const toolCalls =
    data.response?.choices?.[0]?.message?.tool_calls?.map(
      (tc: {
        function?: { name: string; arguments: string }
        result?: string
      }) => ({
        name: tc.function?.name || "unknown",
        arguments: tc.function?.arguments || "{}",
        result: tc.result,
      })
    ) || []

  return {
    requestId: data.request_id || requestId,
    model: data.model || "unknown",
    messages,
    response: responseText,
    toolCalls,
    inputTokens: data.prompt_tokens || 0,
    outputTokens: data.completion_tokens || 0,
    startTime: data.startTime || "",
    endTime: data.endTime || "",
  }
}

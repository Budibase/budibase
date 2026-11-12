import type {
  AgentLogEntry,
  AgentLogEnvironment,
  AgentLogRequestDetail,
  AgentLogSession,
  AgentLogSessionExport,
  LiteLLMRequestDetail,
  LiteLLMRequestRecord,
} from "@budibase/types"
import { HTTPError } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import { getAvailableTools, getOrThrow, getToolDisplayNames } from "../agents"
import {
  fetchLiteLLMRequestRaw,
  fetchLiteLLMRequestRawFromSummary,
  fetchLiteLLMSessionRows,
} from "./liteLLM"
import { getSessionSummary } from "./sessionIndex"
import {
  determineStatus,
  determineTrigger,
  extractError,
  getExpectedEndUser,
  getLiteLLMRequestUser,
  getWorkspaceDbForEnvironment,
  isPreviewSession,
  mapRequestModel,
  toContentString,
} from "./shared"

const EXPORT_CONCURRENCY = 5

async function fetchSessionData(
  agentId: string,
  sessionId: string,
  environment: AgentLogEnvironment
): Promise<{
  session: AgentLogSession | null
  rows: LiteLLMRequestRecord[]
}> {
  const sessionSummaryDb = getWorkspaceDbForEnvironment(environment)
  const { rows: sessionRows, total } = await fetchLiteLLMSessionRows(sessionId)
  const rows = sessionRows
    .filter(row => getLiteLLMRequestUser(row) === getExpectedEndUser(agentId))
    .sort((a, b) => {
      const aTime = new Date(a.startTime || 0).getTime()
      const bTime = new Date(b.startTime || 0).getTime()
      return aTime - bTime
    })
  const liveEntries = rows.map(
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

  const sessionSummary = await getSessionSummary(
    agentId,
    sessionId,
    sessionSummaryDb
  )

  if (!liveEntries.length) {
    return { session: null, rows: [] }
  }

  return {
    session: {
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
    },
    rows,
  }
}

export async function fetchSessionDetail(
  agentId: string,
  sessionId: string,
  environment: AgentLogEnvironment
): Promise<AgentLogSession | null> {
  const { session } = await fetchSessionData(agentId, sessionId, environment)
  return session
}

async function fetchAgentToolDisplayNames(
  agentId: string
): Promise<Record<string, string>> {
  const agent = await getOrThrow(agentId)
  return getToolDisplayNames(await getAvailableTools(agent.aiconfig))
}

function mapRequestDetail(
  data: LiteLLMRequestDetail,
  requestId: string,
  toolDisplayNames: Record<string, string>
): AgentLogRequestDetail {
  const requestMessages = data.proxy_server_request?.messages || []
  const responseMessage = data.response?.choices?.[0]?.message

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

export async function fetchRequestDetail({
  agentId,
  sessionId,
  requestId,
}: {
  agentId: string
  sessionId: string
  requestId: string
}): Promise<AgentLogRequestDetail> {
  const data = await fetchLiteLLMRequestRaw(agentId, requestId)
  if (data.session_id !== sessionId) {
    throw new HTTPError("Agent log detail not found", 404)
  }
  return mapRequestDetail(
    data,
    requestId,
    await fetchAgentToolDisplayNames(agentId)
  )
}

export async function exportSession(
  agentId: string,
  sessionId: string,
  environment: AgentLogEnvironment
): Promise<AgentLogSessionExport | null> {
  const { session, rows } = await fetchSessionData(
    agentId,
    sessionId,
    environment
  )
  if (!session) {
    return null
  }

  const { entries, ...sessionMetadata } = session
  const actions: AgentLogSessionExport["actions"] = new Array(entries.length)
  const toolDisplayNames = await fetchAgentToolDisplayNames(agentId)
  await utils.parallelForeach(
    rows.entries(),
    async ([index, row]) => {
      const requestId = row.request_id || ""
      const data = await fetchLiteLLMRequestRawFromSummary({
        agentId,
        sessionId,
        summary: row,
      })
      actions[index] = {
        entry: entries[index],
        detail: mapRequestDetail(data, requestId, toolDisplayNames),
      }
    },
    EXPORT_CONCURRENCY
  )

  return { session: sessionMetadata, actions }
}

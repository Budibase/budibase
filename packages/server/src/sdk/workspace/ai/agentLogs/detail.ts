import type {
  AgentLogEntry,
  AgentLogEnvironment,
  AgentLogRequestDetail,
  AgentLogSession,
} from "@budibase/types"
import { getAvailableTools, getOrThrow, getToolDisplayNames } from "../agents"
import { fetchLiteLLMRequestRaw, fetchLiteLLMSessionRows } from "./liteLLM"
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

  const sessionSummary = await getSessionSummary(
    agentId,
    sessionId,
    sessionSummaryDb
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

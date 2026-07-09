import { generateText } from "ai"
import type { AgentRequest, AgentRequestAction } from "@budibase/types"
import sdk from "../../.."

interface AgentRequestLinkDecision {
  decision: "existing_thread" | "new_thread"
  requestId?: string
  entryAction?: "append_latest_entry" | "create_new_entry"
}

export interface AgentRequestLinkAnalysis {
  decision: AgentRequestLinkDecision["decision"]
  requestId?: string
  entryAction?: NonNullable<AgentRequestLinkDecision["entryAction"]>
}

interface AgentRequestChatContextMessage {
  role: "user" | "assistant"
  content: string
}

const normalizeTitle = (value: string) =>
  value
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()

const normalizePrompt = (prompt: string) => prompt.trim().replace(/\s+/g, " ")

const extractJson = (value: string): AgentRequestLinkDecision | undefined => {
  const trimmed = value.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  const candidate = jsonMatch?.[0] || trimmed

  try {
    const parsed = JSON.parse(candidate) as Partial<AgentRequestLinkDecision>
    if (
      parsed.decision !== "existing_thread" &&
      parsed.decision !== "new_thread"
    ) {
      return undefined
    }
    if (
      parsed.decision === "existing_thread" &&
      (!parsed.requestId ||
        (parsed.entryAction !== "append_latest_entry" &&
          parsed.entryAction !== "create_new_entry"))
    ) {
      return undefined
    }
    return parsed as AgentRequestLinkDecision
  } catch {
    return undefined
  }
}

const buildCandidateSummary = (request: AgentRequest) => ({
  requestId: request._id,
  title: request.title,
  status: request.status,
  updatedAt: request.updatedAt,
  recentEntries: request.entries.slice(-3).map(entry => ({
    sessionId: entry.sessionId,
    source: entry.source,
    operationNames: entry.operationNames,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    status: entry.status,
  })),
})

export async function analyzeAgentRequestLink({
  latestPrompt,
  candidateRequests,
  recentChatContext,
  agentId,
  sessionId,
}: {
  latestPrompt: string
  candidateRequests: AgentRequest[]
  recentChatContext?: AgentRequestChatContextMessage[]
  agentId: string
  sessionId: string
}): Promise<AgentRequestLinkAnalysis> {
  const normalizedPrompt = normalizePrompt(latestPrompt)
  if (!normalizedPrompt) {
    return {
      decision: "new_thread",
    }
  }

  if (candidateRequests.length === 0) {
    return {
      decision: "new_thread",
    }
  }

  let result
  try {
    const agent = await sdk.ai.agents.getOrThrow(agentId)
    const llm = await sdk.ai.llm.createLLM(
      agent.aiconfig,
      sessionId,
      undefined,
      agentId
    )
    result = await generateText({
      model: llm.chat,
      providerOptions: llm.providerOptions?.(false),
      headers: {
        "x-litellm-tags": "bb-agent-request-analyser",
      },
      messages: [
        {
          role: "system",
          content:
            'You decide whether a user message belongs to an existing agent request or should start a new one. Reply with JSON only. For a new request, use {"decision":"new_thread"}. For an existing request, use {"decision":"existing_thread","requestId":"<requestId>","entryAction":"append_latest_entry"} when the message is a follow-up to the latest entry, or {"decision":"existing_thread","requestId":"<requestId>","entryAction":"create_new_entry"} when it belongs to the same overall request but starts a distinct sub-request. Treat a new concrete ask for a different item, resource, or deliverable as a new request, even if the user phrases it as "also need", "also want", or a related follow-up.',
        },
        {
          role: "user",
          content: JSON.stringify({
            currentSessionId: sessionId,
            latestPrompt: normalizedPrompt,
            recentChatContext,
            candidateRequests: candidateRequests.map(buildCandidateSummary),
          }),
        },
      ],
    })
  } catch (error) {
    console.error("Failed to analyze agent request link", {
      agentId,
      sessionId,
      error,
    })
    throw error
  }

  const decision = extractJson(result.text || "")
  if (!decision) {
    throw new Error("Invalid agent request link response")
  }

  if (
    decision.decision === "existing_thread" &&
    !candidateRequests.some(request => request._id === decision.requestId)
  ) {
    throw new Error(
      `Invalid agent request link response: unknown requestId "${decision.requestId}"`
    )
  }

  return {
    decision: decision.decision,
    requestId: decision.requestId,
    entryAction: decision.entryAction,
  }
}

export async function generateAgentRequestTitle({
  latestPrompt,
  agentId,
  sessionId,
  operation,
}: {
  latestPrompt: string
  agentId: string
  sessionId: string
  operation?: {
    name: string
    prompt: string
  }
}): Promise<string> {
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const llm = await sdk.ai.llm.createLLM(
    agent.aiconfig,
    sessionId,
    undefined,
    agentId
  )
  const result = await generateText({
    model: llm.chat,
    providerOptions: llm.providerOptions?.(false),
    headers: {
      "x-litellm-tags": "bb-agent-request-title",
    },
    messages: [
      {
        role: "system",
        content:
          "Write a short UI title for a tracked user request. Base it primarily on the user's actual ask, and use the selected operation only as supporting context. Do not invent internal workflow names, implementation details, or analysis phrasing. Prefer concrete user-facing nouns like the requested item, task, or deliverable. Return plain text only. Use 3 to 8 words, no quotes, no punctuation unless necessary.",
      },
      {
        role: "user",
        content: JSON.stringify({
          operation,
          latestPrompt,
        }),
      },
    ],
  })

  const title = normalizeTitle(result.text || "")
  if (!title) {
    throw new Error("Invalid agent request title response")
  }

  return title
}

export async function generateToolCallSummary({
  toolName,
  readableName,
  status,
  input,
  output,
  agentId,
  sessionId,
}: {
  toolName: string
  readableName?: string
  status: "success" | "error"
  input?: unknown
  output?: unknown
  agentId: string
  sessionId: string
}): Promise<string> {
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const llm = await sdk.ai.llm.createLLM(
    agent.aiconfig,
    sessionId,
    undefined,
    agentId
  )
  const result = await generateText({
    model: llm.chat,
    providerOptions: llm.providerOptions?.(false),
    headers: {
      "x-litellm-tags": "bb-agent-request-tool-call-summary",
    },
    messages: [
      {
        role: "system",
        content:
          'Summarize a single tool call for a UI timeline entry, in plain user-friendly language, not technical jargon - describe what the action did and its outcome, e.g. "Searched tickets for email server errors" or "Failed to update the customer\'s address". Return plain text only. Use at most 6 to 7 words, no quotes, no punctuation unless necessary.',
      },
      {
        role: "user",
        content: JSON.stringify({
          tool: readableName || toolName,
          status,
          input,
          output,
        }),
      },
    ],
  })

  const summary = normalizeTitle(result.text || "")
  if (!summary) {
    throw new Error("Invalid tool call summary response")
  }

  return summary
}

export async function generateInteractionSummary({
  latestPrompt,
  agentId,
  sessionId,
}: {
  latestPrompt: string
  agentId: string
  sessionId: string
}): Promise<string> {
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const llm = await sdk.ai.llm.createLLM(
    agent.aiconfig,
    sessionId,
    undefined,
    agentId
  )
  const result = await generateText({
    model: llm.chat,
    providerOptions: llm.providerOptions?.(false),
    headers: {
      "x-litellm-tags": "bb-agent-request-interaction-summary",
    },
    messages: [
      {
        role: "system",
        content: `Summarize the user's intent in this single message for a UI timeline entry. Write it in third person starting with "User", e.g. "User asked about VPN access". Return plain text only. Use 4 to 6 words, no quotes, no punctuation unless necessary.`,
      },
      {
        role: "user",
        content: latestPrompt,
      },
    ],
  })

  const summary = normalizeTitle(result.text || "")
  if (!summary) {
    throw new Error("Invalid interaction summary response")
  }

  return summary
}

export interface RequestOutcomeDecision {
  status: "completed" | "failed"
  reason: string
}

const summarizeActionForOutcome = (action: AgentRequestAction) => {
  switch (action.type) {
    case "user_message":
      return { type: action.type, summary: action.summary }
    case "tool_call":
      return {
        type: action.type,
        tool: action.readableName || action.toolName,
        status: action.status,
        summary: action.summary,
      }
    case "status_changed":
      return {
        type: action.type,
        from: action.from,
        to: action.to,
        error: action.error,
      }
    case "escalation_raised":
      return { type: action.type, recipients: action.recipients }
  }
}

const extractOutcomeJson = (
  value: string
): RequestOutcomeDecision | undefined => {
  const trimmed = value.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  const candidate = jsonMatch?.[0] || trimmed

  try {
    const parsed = JSON.parse(candidate) as Partial<RequestOutcomeDecision>
    if (parsed.status !== "completed" && parsed.status !== "failed") {
      return undefined
    }
    const reason = typeof parsed.reason === "string" ? parsed.reason.trim() : ""
    if (!reason) {
      return undefined
    }
    return { status: parsed.status, reason }
  } catch {
    return undefined
  }
}

// Judges whether the request's underlying goal was met, not whether every
// tool call technically succeeded - a failed tool call that gets worked
// around is still a success, and an all-success tool sequence that never
// delivers what the user asked for is still a failure. Only two possible
// outcomes: this always resolves a terminal decision, never a third state.
export async function generateRequestOutcome({
  title,
  actions,
  finalResponse,
  toolCallsIncomplete,
  agentId,
  sessionId,
}: {
  title?: string
  actions: AgentRequestAction[]
  finalResponse: string
  toolCallsIncomplete: boolean
  agentId: string
  sessionId: string
}): Promise<RequestOutcomeDecision> {
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const llm = await sdk.ai.llm.createLLM(
    agent.aiconfig,
    sessionId,
    undefined,
    agentId
  )
  const result = await generateText({
    model: llm.chat,
    providerOptions: llm.providerOptions?.(false),
    headers: {
      "x-litellm-tags": "bb-agent-request-outcome",
    },
    messages: [
      {
        role: "system",
        content:
          'Decide whether a tracked user request was actually fulfilled, based on its full timeline (the user\'s asks and every tool call the agent made, in order, with each outcome) and the agent\'s final reply. Judge only the underlying goal, not the mechanics: a tool call that failed but was worked around some other way is still a success if the goal was met, and a sequence of technically-successful tool calls that never delivered what the user actually asked for is still a failure. toolCallsIncomplete means the model ran out of steps or left a tool call unresolved - judge based on what was actually accomplished and said, not on that fact alone. Reply with JSON only, one of: {"status":"completed","reason":"<short reason>"} or {"status":"failed","reason":"<short reason>"}. status must be exactly one of those two values - there is no partial or in-between outcome.',
      },
      {
        role: "user",
        content: JSON.stringify({
          title,
          toolCallsIncomplete,
          timeline: actions.map(summarizeActionForOutcome),
          finalResponse,
        }),
      },
    ],
  })

  const decision = extractOutcomeJson(result.text || "")
  if (!decision) {
    throw new Error("Invalid agent request outcome response")
  }

  return decision
}

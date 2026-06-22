import { generateText } from "ai"
import type { AgentRequest } from "@budibase/types"
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
  requestId: request.requestId,
  sessionIds: request.sessionIds,
  latestSessionId: request.latestSessionId,
  latestPromptAt: request.latestPromptAt,
  latestCompletedAt: request.latestCompletedAt,
  status: request.status,
  recentEntries: request.entries.slice(-3).map(entry => ({
    entryId: entry.entryId,
    sessionId: entry.sessionId,
    promptHistory: entry.promptHistory,
    interactionCount: entry.interactionCount,
    status: entry.status,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  })),
})

export async function analyzeAgentRequestLink({
  latestPrompt,
  candidateRequests,
  agentId,
  sessionId,
}: {
  latestPrompt: string
  candidateRequests: AgentRequest[]
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
            'You decide whether a user message belongs to an existing agent request or should start a new one. Reply with JSON only. For a new request, use {"decision":"new_thread"}. For an existing request, use {"decision":"existing_thread","requestId":"<requestId>","entryAction":"append_latest_entry"} when the message is a follow-up to the latest entry, or {"decision":"existing_thread","requestId":"<requestId>","entryAction":"create_new_entry"} when it belongs to the same overall request but starts a distinct sub-request.',
        },
        {
          role: "user",
          content: JSON.stringify({
            currentSessionId: sessionId,
            latestPrompt: normalizedPrompt,
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
    !candidateRequests.some(request => request.requestId === decision.requestId)
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

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
  status: request.status,
  recentEntries: request.entries.slice(-3).map(entry => ({
    sessionId: entry.sessionId,
    promptHistory: entry.promptHistory,
    status: entry.status,
    source: entry.source,
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
            'You decide whether a user message belongs to an existing agent request or should start a new one. Reply with JSON only. For a new request, use {"decision":"new_thread"}. For an existing request, use {"decision":"existing_thread","requestId":"<requestId>","entryAction":"append_latest_entry"} when the message is a follow-up to the latest entry, or {"decision":"existing_thread","requestId":"<requestId>","entryAction":"create_new_entry"} when it belongs to the same overall request but starts a distinct sub-request. Treat a new concrete ask for a different item, resource, or deliverable as a new request, even if the user phrases it as "also need", "also want", or a related follow-up.',
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
  request,
  agentId,
  sessionId,
}: {
  request: AgentRequest
  agentId: string
  sessionId: string
}): Promise<string> {
  const latestEntry = request.entries[request.entries.length - 1]
  if (!latestEntry) {
    throw new Error("Cannot generate title without request entries")
  }

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
            latestPrompt: latestEntry.promptHistory[latestEntry.promptHistory.length - 1],
            promptHistory: latestEntry.promptHistory,
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

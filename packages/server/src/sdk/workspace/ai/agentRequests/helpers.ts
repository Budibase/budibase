import { generateText } from "ai"
import type { AgentRequest } from "@budibase/types"
import { createBBAIClient } from "../llm/bbai"

const BBAI_DEFAULT_MODEL = "budibase/v1"

interface AgentRequestBoundaryDecision {
  decision: "same_request" | "new_request"
}

export interface AgentRequestBoundaryAnalysis {
  decision: AgentRequestBoundaryDecision["decision"]
}

const normalizePrompt = (prompt: string) => prompt.trim().replace(/\s+/g, " ")

const extractJson = (
  value: string
): AgentRequestBoundaryDecision | undefined => {
  const trimmed = value.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  const candidate = jsonMatch?.[0] || trimmed

  try {
    const parsed = JSON.parse(
      candidate
    ) as Partial<AgentRequestBoundaryDecision>
    if (
      parsed.decision === "same_request" ||
      parsed.decision === "new_request"
    ) {
      return parsed as AgentRequestBoundaryDecision
    }
  } catch {
    return undefined
  }

  return undefined
}

export async function analyzeAgentRequestBoundary({
  latestPrompt,
  currentRequest,
  agentId,
  sessionId,
}: {
  latestPrompt: string
  currentRequest?: AgentRequest
  agentId: string
  sessionId: string
}): Promise<AgentRequestBoundaryAnalysis> {
  if (!currentRequest) {
    return {
      decision: "new_request",
    }
  }

  const normalizedPrompt = normalizePrompt(latestPrompt)
  if (!normalizedPrompt) {
    return {
      decision: "same_request",
    }
  }

  const llm = await createBBAIClient(
    BBAI_DEFAULT_MODEL,
    `agent-request:${sessionId}`,
    undefined,
    "low",
    agentId
  )
  const result = await generateText({
    model: llm.chat,
    providerOptions: llm.providerOptions?.(false),
    messages: [
      {
        role: "system",
        content:
          'You decide whether a user message starts a new request or continues an existing one. Reply with JSON only in the form {"decision":"same_request"} or {"decision":"new_request"}. Choose "same_request" when the new prompt is a follow-up, transformation, clarification, continuation, or refinement of the earlier request. Choose "new_request" when the user has changed goal or topic.',
      },
      {
        role: "user",
        content: JSON.stringify({
          currentRequestPromptHistory: currentRequest.promptHistory,
          latestPrompt: normalizedPrompt,
        }),
      },
    ],
  })

  const decision = extractJson(result.text || "")
  return {
    decision: decision?.decision || "new_request",
  }
}

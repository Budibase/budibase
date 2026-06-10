import type { AgentRequest } from "@budibase/types"

const SAME_REQUEST_PREFIXES = [
  "summarise",
  "summarize",
  "shorten",
  "rephrase",
  "rewrite",
  "translate",
  "explain",
  "expand",
  "continue",
  "clarify",
  "make it",
  "turn it",
  "put it",
  "format it",
  "now ",
  "also ",
  "and ",
  "what about",
]

const SAME_REQUEST_PATTERNS = [
  /\b(it|that|this|them|those|these|previous|above|same)\b/i,
  /\b(in|under)\s+\d+\s+words?\b/i,
  /\b(shorter|longer|brief|briefly)\b/i,
]

const normalizePrompt = (prompt: string) => prompt.trim().replace(/\s+/g, " ")

export function shouldCreateNewAgentRequest({
  latestPrompt,
  currentRequest,
}: {
  latestPrompt: string
  currentRequest?: AgentRequest
}): boolean {
  if (!currentRequest) {
    return true
  }

  const normalizedPrompt = normalizePrompt(latestPrompt).toLowerCase()
  if (!normalizedPrompt) {
    return false
  }

  if (
    SAME_REQUEST_PREFIXES.some(prefix => normalizedPrompt.startsWith(prefix))
  ) {
    return false
  }

  if (SAME_REQUEST_PATTERNS.some(pattern => pattern.test(normalizedPrompt))) {
    return false
  }

  return true
}

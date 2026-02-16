import { UIMessage, getToolName, isTextUIPart, isToolUIPart } from "ai"
import { ToolCallSnapshot } from "./types"

const COMPLETED_TOOL_STATES = new Set([
  "output-available",
  "output-error",
  "output-denied",
])

export function toLowerTrimmed(value: string): string {
  return value.trim().toLowerCase()
}

export function extractResponseTextFromMessage(message?: UIMessage): string {
  if (!message?.parts) {
    return ""
  }

  return message.parts
    .filter(isTextUIPart)
    .map(part => part.text)
    .join("")
    .trim()
}

export function extractToolCallsFromMessages(messages: UIMessage[]): ToolCallSnapshot[] {
  const calls: ToolCallSnapshot[] = []

  for (const message of messages) {
    if (message.role !== "assistant" || !message.parts) {
      continue
    }

    for (const part of message.parts) {
      if (!isToolUIPart(part)) {
        continue
      }

      const errorText =
        part.state === "output-error" && part.errorText
          ? String(part.errorText)
          : undefined

      calls.push({
        toolName: getToolName(part),
        state: part.state,
        toolCallId: part.toolCallId,
        ...(errorText ? { error: errorText } : {}),
      })
    }
  }

  return calls
}

export function countIncompleteToolCalls(calls: ToolCallSnapshot[]): number {
  return calls.filter(call => !COMPLETED_TOOL_STATES.has(call.state)).length
}

export function countToolErrors(calls: ToolCallSnapshot[]): number {
  return calls.filter(call => call.state === "output-error").length
}

export function estimateQualityRubricScore({
  success,
  responseText,
  missingRequired,
  hasForbiddenResponse,
  requiredToolMisses,
  forbiddenToolHits,
}: {
  success: boolean
  responseText: string
  missingRequired: number
  hasForbiddenResponse: boolean
  requiredToolMisses: number
  forbiddenToolHits: number
}): number {
  if (!success || !responseText.trim()) {
    return 0
  }

  let score = 3

  if (missingRequired === 0) {
    score += 1
  }
  if (!hasForbiddenResponse && responseText.length < 800) {
    score += 0.5
  }
  if (requiredToolMisses === 0 && forbiddenToolHits === 0) {
    score += 0.5
  }

  return Math.max(0, Math.min(5, Number(score.toFixed(2))))
}

export function extractUsageTotalTokens(usage: any): number | undefined {
  if (!usage) {
    return
  }

  if (typeof usage.totalTokens === "number") {
    return usage.totalTokens
  }
  if (typeof usage.total_tokens === "number") {
    return usage.total_tokens
  }
  if (typeof usage.inputTokens?.total === "number") {
    const output = usage.outputTokens?.total ?? 0
    return usage.inputTokens.total + output
  }

  return
}

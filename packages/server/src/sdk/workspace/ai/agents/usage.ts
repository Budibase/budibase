import type { AgentMessageUsage } from "@budibase/types"
import type { LanguageModelUsage } from "ai"

interface BuildAgentMessageUsageParams {
  inputUsage?: LanguageModelUsage
  outputUsage?: LanguageModelUsage
  maxTokens?: number
  systemPromptTokens: number
}

const tokens = (value: number | undefined) => value ?? 0

export const estimateTokens = (value: string) => Math.ceil(value.length / 4)

export const buildAgentMessageUsage = ({
  inputUsage,
  outputUsage,
  maxTokens,
  systemPromptTokens,
}: BuildAgentMessageUsageParams): AgentMessageUsage | undefined => {
  if (!inputUsage) {
    return undefined
  }

  const output = outputUsage ?? inputUsage
  const totalInput = tokens(inputUsage.inputTokens)
  const system = Math.min(systemPromptTokens, totalInput)
  const cachedInput = Math.min(
    tokens(inputUsage.inputTokenDetails.cacheReadTokens),
    totalInput - system
  )
  const input = totalInput - system - cachedInput
  const reasoning = tokens(output.outputTokenDetails.reasoningTokens)
  const outputTokens = Math.max(0, tokens(output.outputTokens) - reasoning)
  const segments: AgentMessageUsage["segments"] = [
    { type: "system", tokens: system },
    { type: "input", tokens: input },
    { type: "cachedInput", tokens: cachedInput },
    { type: "output", tokens: outputTokens },
    { type: "reasoning", tokens: reasoning },
  ]

  return {
    ...(maxTokens === undefined ? {} : { maxTokens }),
    segments: segments.filter(segment => segment.tokens > 0),
  }
}

import {
  InvalidToolInputError,
  type ToolCallRepairFunction,
  type ToolSet,
} from "ai"
import { normalizeToolInputKeys } from "../../../../ai/tools/inputValidation"

const stableValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stableValue)
  }
  if (!value || typeof value !== "object") {
    return value
  }
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, stableValue(child)])
  )
}

export interface ToolCallRetryGuard {
  repairToolCall: ToolCallRepairFunction<ToolSet>
  shouldDisableTools: () => boolean
}

export const createToolCallRetryGuard = (): ToolCallRetryGuard => {
  const failureCounts = new Map<string, number>()
  let disableTools = false

  const repairToolCall: ToolCallRepairFunction<ToolSet> = async ({
    toolCall,
    inputSchema,
    error,
  }) => {
    if (!InvalidToolInputError.isInstance(error)) {
      return null
    }

    let input: unknown
    try {
      input = JSON.parse(toolCall.input)
    } catch {
      return null
    }

    const normalized = normalizeToolInputKeys(
      input,
      await inputSchema({ toolName: toolCall.toolName })
    )
    if (normalized.changed) {
      return {
        ...toolCall,
        input: JSON.stringify(normalized.value),
      }
    }

    const signature = `${toolCall.toolName}:${JSON.stringify(
      stableValue(input)
    )}`
    const failureCount = (failureCounts.get(signature) ?? 0) + 1
    failureCounts.set(signature, failureCount)
    if (failureCount >= 2) {
      disableTools = true
    }

    return null
  }

  return {
    repairToolCall,
    shouldDisableTools: () => disableTools,
  }
}

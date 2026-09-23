import {
  InvalidToolInputError,
  type ToolCallRepairFunction,
  type ToolSet,
} from "ai"
import { safeValidateTypes } from "@ai-sdk/provider-utils"
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

export const createToolCallRetryGuard = (
  mutatingToolNames: ReadonlySet<string>
): ToolCallRetryGuard => {
  const failureCounts = new Map<string, number>()
  let disableTools = false

  const recordFailure = (signature: string) => {
    const failureCount = (failureCounts.get(signature) ?? 0) + 1
    failureCounts.set(signature, failureCount)
    if (failureCount >= 2) {
      disableTools = true
    }
  }

  const repairToolCall: ToolCallRepairFunction<ToolSet> = async ({
    toolCall,
    tools,
    inputSchema,
    error,
  }) => {
    if (
      !mutatingToolNames.has(toolCall.toolName) ||
      !InvalidToolInputError.isInstance(error)
    ) {
      return null
    }

    let input: unknown
    try {
      input = JSON.parse(toolCall.input)
    } catch {
      recordFailure(`${toolCall.toolName}:raw:${toolCall.input}`)
      return null
    }

    const signature = `${toolCall.toolName}:${JSON.stringify(
      stableValue(input)
    )}`
    const normalized = normalizeToolInputKeys(
      input,
      await inputSchema({ toolName: toolCall.toolName })
    )
    if (normalized.changed) {
      const normalizedSignature = `${toolCall.toolName}:${JSON.stringify(
        stableValue(normalized.value)
      )}`
      const tool = tools[toolCall.toolName]
      if (tool) {
        const validation = await safeValidateTypes({
          value: normalized.value,
          schema: tool.inputSchema,
        })
        if (!validation.success) {
          recordFailure(normalizedSignature)
        } else {
          failureCounts.delete(signature)
          failureCounts.delete(normalizedSignature)
        }
      }
      return {
        ...toolCall,
        input: JSON.stringify(normalized.value),
      }
    }

    recordFailure(signature)

    return null
  }

  return {
    repairToolCall,
    shouldDisableTools: () => disableTools,
  }
}

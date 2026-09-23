import {
  InvalidToolInputError,
  type ToolCallRepairFunction,
  type ToolSet,
} from "ai"
import { normalizeToolInputKeys } from "../../../../ai/tools/inputValidation"

export const repairToolCall: ToolCallRepairFunction<ToolSet> = async ({
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
  if (!normalized.changed) {
    return null
  }

  return {
    ...toolCall,
    input: JSON.stringify(normalized.value),
  }
}

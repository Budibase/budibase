import { ChatConversation } from "@budibase/types"
import { isToolUIPart } from "ai"

const MAX_PERSISTED_TOOL_TEXT_LENGTH = 8_000

const truncatePersistedText = (value: string) => {
  if (value.length <= MAX_PERSISTED_TOOL_TEXT_LENGTH) {
    return value
  }

  return `${value.slice(0, MAX_PERSISTED_TOOL_TEXT_LENGTH).trimEnd()}\n...[truncated]`
}

const truncatePersistedToolValue = (value: unknown) => {
  try {
    if (typeof value === "string") {
      return truncatePersistedText(value)
    }

    const serialized = JSON.stringify(value)
    if (!serialized || serialized.length <= MAX_PERSISTED_TOOL_TEXT_LENGTH) {
      return value
    }

    return {
      truncated: true,
      originalType: Array.isArray(value) ? "array" : typeof value,
      preview: truncatePersistedText(serialized),
    }
  } catch (error) {
    return value
  }
}

export const truncateToolPartsForSave = (
  messages: ChatConversation["messages"]
): ChatConversation["messages"] =>
  messages.map(message => ({
    ...message,
    parts: message.parts.map(part => {
      if (!isToolUIPart(part)) {
        return part
      }

      if (part.state === "output-available") {
        return {
          ...part,
          output: truncatePersistedToolValue(part.output),
        }
      }

      if (part.state === "output-error") {
        return {
          ...part,
          errorText: truncatePersistedText(part.errorText),
          ...(part.input !== undefined && {
            input: truncatePersistedToolValue(part.input),
          }),
        }
      }

      return part
    }),
  }))

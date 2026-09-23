import type { Message } from "@budibase/types"
import type { ModelMessage } from "ai"

export function toPrompt(messages: Message[]): {
  instructions?: string
  messages: ModelMessage[]
} {
  const instructions: string[] = []
  const modelMessages: ModelMessage[] = []
  for (const message of messages) {
    if (typeof message.content !== "string") {
      throw new Error("AI message content must be a string")
    }
    if (message.role === "tool") {
      throw new Error("AI tool messages are not supported")
    }
    if (message.role === "system") {
      instructions.push(message.content)
    } else {
      modelMessages.push({
        role: message.role,
        content: message.content,
      } as ModelMessage)
    }
  }
  return {
    instructions: instructions.join("\n\n") || undefined,
    messages: modelMessages,
  }
}

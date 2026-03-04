import type { Message } from "@budibase/types"
import type { ModelMessage } from "ai"

export function toModelMessages(messages: Message[]): ModelMessage[] {
  return messages.map<ModelMessage>(message => {
    if (typeof message.content !== "string") {
      throw new Error("AI message content must be a string")
    }
    if (message.role === "tool") {
      throw new Error("AI tool messages are not supported")
    }
    return {
      role: message.role as Exclude<ModelMessage["role"], "tool">,
      content: message.content,
    }
  })
}

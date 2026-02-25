import { Message } from "@budibase/types"
import { generateText, type ModelMessage } from "ai"
import sdk from "../../../sdk"

function toModelMessages(messages: Message[]): ModelMessage[] {
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

export async function promptWithDefaultLLM(messages: Message[]) {
  const { chat, providerOptions } = await sdk.ai.llm.getDefaultLLMOrThrow()
  const response = await generateText({
    model: chat,
    messages: toModelMessages(messages),
    providerOptions: providerOptions?.(false),
  })
  return response.text
}

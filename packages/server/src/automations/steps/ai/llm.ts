import type { Message } from "@budibase/types"
import { generateText } from "ai"
import sdk from "../../../sdk"
import { toModelMessages } from "../../../sdk/workspace/ai/llm/messages"

export async function promptWithDefaultLLM(messages: Message[]) {
  const { chat, providerOptions } = await sdk.ai.llm.getDefaultLLMOrThrow()
  const response = await generateText({
    model: chat,
    messages: toModelMessages(messages),
    providerOptions: providerOptions?.(false),
  })
  return response.text
}

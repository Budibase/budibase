import { generateText, type ModelMessage } from "ai"
import { ai } from "@budibase/pro"

import type { GenerateAgentInstructionsRequest } from "@budibase/types"
import sdk from "../.."

const MARKDOWN_CODE_BLOCK = /```(?:\w+)?\n([\s\S]+?)\n```/

function stripCodeFence(value: string) {
  const match = value.match(MARKDOWN_CODE_BLOCK)
  return match ? match[1] : value
}

export async function generateAgentInstructions({
  aiconfigId,
  prompt,
  agentName,
  goal,
}: GenerateAgentInstructionsRequest) {
  const request = ai.generateAgentInstructionsPrompt({
    prompt,
    agentName,
    goal,
  })

  const systemMessage = request.messages.find(
    message => message.role === "system"
  )?.content
  const userMessage = request.messages.find(
    message => message.role === "user"
  )?.content

  if (typeof systemMessage !== "string" || typeof userMessage !== "string") {
    throw new Error("AI prompt messages must be strings")
  }

  const messages: ModelMessage[] = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ]

  const { chat, providerOptions } = await sdk.ai.llm.createLLM(aiconfigId)
  const result = await generateText({
    model: chat,
    messages,
    providerOptions: providerOptions?.(false),
  })

  const instructions = stripCodeFence(result.text || "").trim()

  if (!instructions) {
    throw new Error("Failed to generate instructions")
  }

  return instructions
}

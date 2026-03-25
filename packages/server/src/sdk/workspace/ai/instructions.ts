import { generateText, type ModelMessage } from "ai"
import { ai } from "@budibase/pro"

import type { GenerateAgentInstructionsRequest } from "@budibase/types"
import sdk from "../.."

const MARKDOWN_CODE_BLOCK = /```(?:\w+)?\n([\s\S]+?)\n```/
const THINK_BLOCK = /<think>[\s\S]*?<\/think>/gi
const SYSTEM_REMINDER_BLOCK = /<system-reminder>[\s\S]*?<\/system-reminder>/gi
const XML_TAG_LINE = /^<[^>]+>\s*$/gm

function stripCodeFence(value: string) {
  const match = value.match(MARKDOWN_CODE_BLOCK)
  return match ? match[1] : value
}

function sanitizeInstructions(value: string) {
  return stripCodeFence(value)
    .replace(THINK_BLOCK, "")
    .replace(SYSTEM_REMINDER_BLOCK, "")
    .replace(XML_TAG_LINE, "")
    .trim()
}

export async function generateAgentInstructions({
  prompt,
  agentName,
  goal,
  toolReferences,
}: GenerateAgentInstructionsRequest) {
  const request = ai.generateAgentInstructionsPrompt({
    prompt,
    agentName,
    goal,
    toolReferences,
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

  const { chat, providerOptions } = await sdk.ai.llm.getDefaultLLMOrThrow()
  const result = await generateText({
    model: chat,
    messages,
    providerOptions: providerOptions?.(false),
  })

  const instructions = sanitizeInstructions(result.text || "")

  if (!instructions) {
    throw new Error("Failed to generate instructions")
  }

  return instructions
}

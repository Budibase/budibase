import { generateText, type ModelMessage } from "ai"
import {
  type Ctx,
  type GenerateAgentInstructionsRequest,
  type GenerateAgentInstructionsResponse,
} from "@budibase/types"
import sdk from "../../../sdk"

const MARKDOWN_CODE_BLOCK = /```(?:\w+)?\n([\s\S]+?)\n```/

const SYSTEM_PROMPT = `You write instruction prompts for Budibase agents.

Return only the final instructions text.
Do not include explanations, preamble, commentary, or markdown code fences.

The output must use exactly these sections and headings:

**Agent role**
<short paragraph>

**Inputs**
<short paragraph>

**Actions**
- <bullet>
- <bullet>

**Output**
- <bullet>
- <bullet>

**Rules**
- <bullet>
- <bullet>

Write concise, practical instructions that help the agent behave well in Budibase.
Prefer clear operational guidance over abstract advice.`

function stripCodeFence(value: string) {
  const match = value.match(MARKDOWN_CODE_BLOCK)
  return match ? match[1] : value
}

export async function generateAgentInstructions(
  ctx: Ctx<GenerateAgentInstructionsRequest, GenerateAgentInstructionsResponse>
) {
  const { aiconfigId, prompt, agentName, goal } = ctx.request.body

  if (!aiconfigId) {
    ctx.throw(400, "Missing required field: aiconfigId")
  }

  if (!prompt?.trim()) {
    ctx.throw(400, "Missing required field: prompt")
  }

  console.log("Generate agent instructions prompt:", prompt)

  const messages: ModelMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Generate instructions for a Budibase agent using this request:

Prompt:
${prompt.trim()}

Agent name:
${agentName?.trim() || "Not provided"}

Goal:
${goal?.trim() || "Not provided"}`,
    },
  ]

  const { chat, providerOptions } = await sdk.ai.llm.createLLM(aiconfigId)
  const result = await generateText({
    model: chat,
    messages,
    providerOptions: providerOptions?.(false),
  })

  const instructions = stripCodeFence(result.text || "").trim()

  if (!instructions) {
    ctx.throw(500, "Failed to generate instructions")
  }

  ctx.body = { instructions }
}

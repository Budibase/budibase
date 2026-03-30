import {
  type Ctx,
  type GenerateAgentInstructionsRequest,
  type GenerateAgentInstructionsResponse,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function generateAgentInstructions(
  ctx: Ctx<GenerateAgentInstructionsRequest, GenerateAgentInstructionsResponse>
) {
  const { prompt, agentName, goal } = ctx.request.body
  const toolReferences = Array.isArray(ctx.request.body.toolReferences)
    ? ctx.request.body.toolReferences
    : []

  if (!prompt?.trim()) {
    ctx.throw(400, "Missing required field: prompt")
  }

  const instructions = await sdk.ai.generateAgentInstructions({
    prompt,
    agentName,
    goal,
    toolReferences,
  })

  ctx.body = { instructions }
}

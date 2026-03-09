import {
  type Ctx,
  type GenerateAgentInstructionsRequest,
  type GenerateAgentInstructionsResponse,
} from "@budibase/types"
import sdk from "../../../sdk"

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

  const instructions = await sdk.ai.generateAgentInstructions({
    aiconfigId,
    prompt,
    agentName,
    goal,
  })

  ctx.body = { instructions }
}

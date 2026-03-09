import {
  type Ctx,
  type GenerateAgentInstructionsRequest,
  type GenerateAgentInstructionsResponse,
} from "@budibase/types"

export async function generateAgentInstructions(
  ctx: Ctx<GenerateAgentInstructionsRequest, GenerateAgentInstructionsResponse>
) {
  const { aiconfigId, prompt } = ctx.request.body

  if (!aiconfigId) {
    ctx.throw(400, "Missing required field: aiconfigId")
  }

  console.log("Generate agent instructions prompt:", prompt)

  await new Promise(resolve => setTimeout(resolve, 3000))

  ctx.body = {}
}

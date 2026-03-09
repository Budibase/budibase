import {
  type Ctx,
  type GenerateAgentInstructionsRequest,
  type GenerateAgentInstructionsResponse,
} from "@budibase/types"

export async function generateAgentInstructions(
  ctx: Ctx<GenerateAgentInstructionsRequest, GenerateAgentInstructionsResponse>
) {
  const { aiconfigId } = ctx.request.body

  if (!aiconfigId) {
    ctx.throw(400, "Missing required field: aiconfigId")
  }

  await new Promise(resolve => setTimeout(resolve, 3000))

  ctx.body = {}
}

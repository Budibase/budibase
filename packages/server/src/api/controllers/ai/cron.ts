import { Ctx, GenerateCronRequest, GenerateCronResponse } from "@budibase/types"
import { getPreferredLLMOrThrow } from "../../../sdk/workspace/ai/llm"

export async function generateCronExpression(
  ctx: Ctx<GenerateCronRequest, GenerateCronResponse>
) {
  const llm = await getPreferredLLMOrThrow()

  const { prompt } = ctx.request.body
  const { message } = await llm.generateCronExpression(prompt)

  if (message?.startsWith("Error generating cron:")) {
    ctx.throw(400, message)
  } else {
    ctx.body = { message }
  }
}

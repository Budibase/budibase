import { Ctx, GenerateCronRequest, GenerateCronResponse } from "@budibase/types"
import { ai } from "@budibase/pro"

export async function generateCronExpression(
  ctx: Ctx<GenerateCronRequest, GenerateCronResponse>
) {
  const llm = await ai.getLLMOrThrow()

  const { prompt } = ctx.request.body
  const { message } = await llm.generateCronExpression(prompt)

  if (message?.startsWith("Error generating cron:")) {
    ctx.throw(400, message)
  } else {
    ctx.body = { message }
  }
}

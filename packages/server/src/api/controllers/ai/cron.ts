import { generateText } from "ai"
import { Ctx, GenerateCronRequest, GenerateCronResponse } from "@budibase/types"
import { ai } from "@budibase/pro"
import sdk from "../../../sdk"

export async function generateCronExpression(
  ctx: Ctx<GenerateCronRequest, GenerateCronResponse>
) {
  const { prompt } = ctx.request.body
  const llm = await sdk.ai.llm.getDefaultLLMOrThrow()
  const request = ai.generateCronExpression(prompt)
  const result = await generateText({
    model: llm.chat,
    messages: request.messages,
    providerOptions: llm.providerOptions?.(false),
  })
  const message = result.text || ""

  if (message?.startsWith("Error generating cron:")) {
    ctx.throw(400, message)
  } else {
    ctx.body = { message }
  }
}

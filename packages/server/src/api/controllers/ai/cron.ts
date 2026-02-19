import { generateText, type ModelMessage } from "ai"
import { Ctx, GenerateCronRequest, GenerateCronResponse } from "@budibase/types"
import { ai } from "@budibase/pro"
import sdk from "../../../sdk"

export async function generateCronExpression(
  ctx: Ctx<GenerateCronRequest, GenerateCronResponse>
) {
  const { prompt } = ctx.request.body
  const request = ai.generateCronExpression(prompt)
  const userMessage = request.messages.find(
    message => message.role === "user"
  )?.content
  if (typeof userMessage !== "string") {
    throw new Error("AI user message must be a string")
  }

  const messages: ModelMessage[] = [{ role: "user", content: userMessage }]

  const { chat, providerOptions } = await sdk.ai.llm.getDefaultLLMOrThrow()
  const result = await generateText({
    model: chat,
    messages,
    providerOptions: providerOptions?.(false),
  })
  const message = result.text?.trim()

  if (message?.startsWith("Error generating cron:")) {
    ctx.throw(400, message)
  } else {
    ctx.body = { message }
  }
}

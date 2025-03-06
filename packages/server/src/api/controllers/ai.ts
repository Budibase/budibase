import { env, features } from "@budibase/backend-core"
import {
  FeatureFlag,
  GenerateJsRequest,
  GenerateJsResponse,
  UserCtx,
} from "@budibase/types"
import OpenAI from "openai"

export async function generateJs(
  ctx: UserCtx<GenerateJsRequest, GenerateJsResponse>
) {
  if (!(await features.isEnabled(FeatureFlag.AI_JS_GENERATION))) {
    ctx.throw(400, "AI JS generation is disabled")
  }

  if (!env.OPENAI_API_KEY) {
    ctx.throw(400, "OpenAI API key is not set")
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY })

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert in writing JavaScript for the Budibase low-code platform.",
      },
      {
        role: "user",
        content: "",
      },
    ],
  })

  ctx.body = {
    success: true,
    code: response.choices[0].message.content,
  }
}

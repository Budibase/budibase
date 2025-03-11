import { env, features } from "@budibase/backend-core"
import {
  FeatureFlag,
  GenerateCronRequest,
  GenerateCronResponse,
  GenerateJsRequest,
  GenerateJsResponse,
  UserCtx,
} from "@budibase/types"
import OpenAI from "openai"
import { LargeLanguageModel, Prompts } from "../../ai"

const MARKDOWN_CODE_BLOCK = /```(?:\w+)?\n([\s\S]+?)\n```/

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
  const { prompt } = ctx.request.body

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
You are a helpful expert in writing JavaScript.  A user is asking you for help
writing some JavaScript for their application.

Your reply MUST only contain JavaScript code. No explanations,
no markdown, no delimiters around it. It is crucial for it to only
be the code itself.

The code you are to return is a JavaScript function, except without
the function signature, opening brace, and closing brace. Just the
content of the function. The wrapper around the function is
generated elsewhere.
          `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  let code = response.choices[0].message.content!
  const match = code.match(MARKDOWN_CODE_BLOCK)
  if (match) {
    code = match[1]
  }

  ctx.body = { code }
}

export async function generateCronExpression(
  ctx: UserCtx<GenerateCronRequest, GenerateCronResponse>
) {
  const { prompt } = ctx.request.body
  const llm = await LargeLanguageModel.forCurrentTenant("gpt-4o-mini")
  const response = await llm.run(Prompts.generateCronExpression(prompt))
  if (response?.startsWith("Error generating cron:")) {
    ctx.throw(400, response)
  } else {
    ctx.body = { message: response }
  }
}

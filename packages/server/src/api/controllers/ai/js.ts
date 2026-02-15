import { generateText } from "ai"
import { GenerateJsRequest, GenerateJsResponse, UserCtx } from "@budibase/types"
import { context } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import sdk from "../../../sdk"

const MARKDOWN_CODE_BLOCK = /```(?:\w+)?\n([\s\S]+?)\n```/

export async function generateJs(
  ctx: UserCtx<GenerateJsRequest, GenerateJsResponse>
) {
  await context.ensureSnippetContext()
  const currentContext = context.getCurrentContext()
  const snippets = currentContext?.snippets || []
  const { prompt, bindings = [] } = ctx.request.body

  const { messages } = ai.generateJs(bindings, snippets).addUserMessage(prompt)

  const { chat, providerOptions } = await sdk.ai.llm.getDefaultLLMOrThrow()
  const result = await generateText({
    model: chat,
    messages,
    providerOptions: providerOptions?.(false),
  })

  let code = result.text || ""
  const match = code.match(MARKDOWN_CODE_BLOCK)
  if (match) {
    code = match[1]
  }
  ctx.body = { code }
}

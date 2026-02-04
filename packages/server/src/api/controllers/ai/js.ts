import { GenerateJsRequest, GenerateJsResponse, UserCtx } from "@budibase/types"
import { context } from "@budibase/backend-core"
import sdk from "../../../sdk"

const MARKDOWN_CODE_BLOCK = /```(?:\w+)?\n([\s\S]+?)\n```/

export async function generateJs(
  ctx: UserCtx<GenerateJsRequest, GenerateJsResponse>
) {
  const llm = await sdk.ai.getPreferredLLMOrThrow()

  await context.ensureSnippetContext()
  const currentContext = context.getCurrentContext()
  const snippets = currentContext?.snippets || []
  const { prompt, bindings = [] } = ctx.request.body

  let code =
    (await llm.generateJs(prompt, { bindings, snippets })).message || ""
  const match = code.match(MARKDOWN_CODE_BLOCK)
  if (match) {
    code = match[1]
  }
  ctx.body = { code }
}

import {
  FeatureFlag,
  GenerateJsRequest,
  GenerateJsResponse,
  UserCtx,
} from "@budibase/types"
import { context, features } from "@budibase/backend-core"
import { ai } from "@budibase/pro"

const MARKDOWN_CODE_BLOCK = /```(?:\w+)?\n([\s\S]+?)\n```/

export async function generateJs(
  ctx: UserCtx<GenerateJsRequest, GenerateJsResponse>
) {
  if (!(await features.isEnabled(FeatureFlag.AI_JS_GENERATION))) {
    ctx.throw(500, "AI JS generation is disabled")
  }

  const llm = await ai.getLLMOrThrow()

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

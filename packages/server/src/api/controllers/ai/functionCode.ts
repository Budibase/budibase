import { generateText } from "ai"
import type {
  GenerateFunctionCodeRequest,
  GenerateFunctionCodeResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

const CODE_BLOCK = /^```(?:typescript|ts|javascript|js)?\s*\n([\s\S]*?)\n```$/i

export const generateFunctionCode = async (
  ctx: UserCtx<GenerateFunctionCodeRequest, GenerateFunctionCodeResponse>
) => {
  const { prompt, functionName, source, queries } = ctx.request.body
  const { chat, providerOptions } = await sdk.ai.llm.getDefaultLLMOrThrow()
  const result = await generateText({
    model: chat,
    instructions: `You write complete Budibase Function TypeScript modules. Return only the complete source code, without Markdown or explanation. The only import permitted is from "@budibase/functions". Import inputs, queries, and type FunctionResult as needed. Export a default async function returning Promise<FunctionResult>. Its return value must contain an output object. Only use the linked queries listed in the request. Do not use fetch, window, process, or unrelated APIs.`,
    prompt: `Function name: ${functionName}
Linked queries:
${queries.map(query => `- queries.${query.datasourceAlias}.${query.queryAlias}(${query.parameterNames.join(", ")})`).join("\n") || "None"}
Current source:
${source}
Requested change:
${prompt}`,
    providerOptions: providerOptions?.(false),
  })

  const code = (result.text || "").trim()
  ctx.body = { code: code.match(CODE_BLOCK)?.[1] || code }
}

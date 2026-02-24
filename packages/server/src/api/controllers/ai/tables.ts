import { ai } from "@budibase/pro"
import {
  GenerateTablesRequest,
  GenerateTablesResponse,
  UserCtx,
} from "@budibase/types"
import environment from "../../../environment"
import sdk from "../../../sdk"

export async function generateTables(
  ctx: UserCtx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const timeoutMs = parseInt(environment.TABLE_GENERATION_TIMEOUT_MS, 10)
  if (!isNaN(timeoutMs) && timeoutMs > 0) {
    ctx.req.setTimeout(timeoutMs)
    ctx.res.setTimeout(timeoutMs)
  }

  const { prompt } = ctx.request.body
  const llm = await sdk.ai.llm.getDefaultLLMOrThrow()

  const tableGenerator = await ai.TableGeneration.init(llm, {
    generateTablesDelegate: sdk.ai.helpers.generateTables,
    generateDataDelegate: sdk.ai.helpers.generateRows,
  })

  const createdTables = await tableGenerator.generate(
    prompt,
    ctx.user._id || ""
  )

  ctx.body = {
    createdTables,
  }
}

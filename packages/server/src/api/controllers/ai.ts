import {
  Ctx,
  GenerateTablesRequest,
  GenerateTablesResponse,
} from "@budibase/types"
import { getLLM } from "packages/pro/src/ai"

export async function generateTables(
  ctx: Ctx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const llm = await getLLM()
  const response = await llm?.generateTables(ctx.request.body.prompt)

  ctx.body = {
    response: response?.message ?? undefined,
  }
}

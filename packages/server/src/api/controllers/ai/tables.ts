import {
  GenerateTablesRequest,
  GenerateTablesResponse,
  UserCtx,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import sdk from "../../../sdk"

export async function generateTables(
  ctx: UserCtx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const { prompt } = ctx.request.body

  const tableGenerator = await ai.TableGeneration.init({
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

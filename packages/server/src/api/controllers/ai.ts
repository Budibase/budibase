import {
  GenerateTablesRequest,
  GenerateTablesResponse,
  UserCtx,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import sdk from "../../sdk"

export async function generateTables(
  ctx: UserCtx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const { prompt, addData } = ctx.request.body

  const tableGenerator = await ai.TableGeneration.init({
    generateTablesDelegate: sdk.ai.helpers.generateTables,
    getTablesDelegate: sdk.tables.getTables,
    generateDataDelegate: sdk.ai.helpers.generateRows,
  })
  if (addData) {
    tableGenerator.withData(ctx.user._id || "")
  }
  const createdTables = await tableGenerator.generate(prompt)

  ctx.body = {
    createdTables,
  }
}

import {
  GenerateTablesRequest,
  GenerateTablesResponse,
  SourceName,
  UserCtx,
} from "@budibase/types"
import { getLLM } from "packages/pro/src/ai"
import * as tableController from "./public/tables"
import { context } from "@budibase/backend-core"
import sdk from "../../sdk"
import { generateDatasourceID } from "../../db/utils"
import fs from "fs"
import path from "path"

export async function generateTables(
  ctx: UserCtx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const llm = await getLLM()
  llm!.maxTokens = 1200
  const response = await llm?.generateTables(ctx.request.body.prompt)

  const count = (await sdk.datasources.fetch()).length
  const { id: dsId } = await context.getAppDB().put({
    _id: generateDatasourceID(),
    name: `Test ${count}`,
    type: "budibase",

    source: SourceName.BUDIBASE,
    config: {},
  })

  console.warn(response?.message)

  fs.writeFileSync(
    path.join(process.env.PWD!, `../../llm-output/response_${Date.now()}.json`),
    response?.message || ""
  )

  const json = JSON.parse(response!.message || "")
  for (const table of json) {
    await tableController.create(
      {
        request: { body: { ...table, sourceId: dsId } },
        user: ctx.user,
      } as any,
      async () => {}
    )
  }

  ctx.body = {
    response: response?.message ?? undefined,
  }
}

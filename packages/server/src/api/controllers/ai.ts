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
import { createHash } from "crypto"

export async function generateTables(
  ctx: UserCtx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const { prompt, useCached, addData } = ctx.request.body

  const llm = await getLLM()
  llm!.maxTokens = 1200

  const cacheKey = `${createHash("md5").update(prompt).digest("hex")}_${
    addData ? 1 : 0
  }`

  const response = await llm?.generateTables(
    prompt,
    useCached ? cacheKey : "",
    addData
  )

  const count = (await sdk.datasources.fetch()).length
  const { id: dsId } = await context.getAppDB().put({
    _id: generateDatasourceID(),
    name: `Test ${count}`,
    type: "budibase",

    source: SourceName.BUDIBASE,
    config: {},
  })

  console.warn(response?.message)

  if (!useCached) {
    fs.writeFileSync(
      path.join(process.env.PWD!, `../../llm-output/${cacheKey}.json`),
      response?.message || ""
    )
  }

  const json = JSON.parse(response!.message || "")
  const createdTables: GenerateTablesResponse["createdTables"] = []
  for (const table of json.structure) {
    const createTableCtx = {
      request: { body: { ...table, sourceId: dsId } },
      user: ctx.user,
    } as any
    await tableController.create(createTableCtx, async () => {})
    const createdTable = createTableCtx.body
    createdTables.push({ id: createdTable._id, name: createdTable.name })

    const dataToAdd = json.data[table.name]
    for (const entry of dataToAdd || []) {
      await sdk.rows.save(
        createdTable._id,
        {
          ...entry,
        },
        ctx.user._id
      )
    }
  }

  ctx.body = {
    response: response?.message ?? undefined,
    createdTables,
  }
}

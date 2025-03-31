import {
  DocumentType,
  FieldType,
  GenerateTablesRequest,
  GenerateTablesResponse,
  RelationshipFieldMetadata,
  SourceName,
  Table,
  UserCtx,
} from "@budibase/types"
import { getLLM } from "packages/pro/src/ai"
import * as tableController from "./public/tables"
import { context, utils } from "@budibase/backend-core"
import sdk from "../../sdk"
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
    useCached ? `${cacheKey}/latest` : "",
    addData
  )

  const count = (await sdk.datasources.fetch()).length
  const { id: dsId } = await context.getAppDB().put({
    _id: `${DocumentType.DATASOURCE}_bb_internal_${utils.newid()}`,
    name: `Test ${count}`,
    type: "budibase",

    source: SourceName.BUDIBASE,
    config: {},
  })

  console.warn(response?.message)

  if (!useCached) {
    const dir = path.join(process.env.PWD!, `../../llm-output/${cacheKey}`)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    fs.writeFileSync(path.join(dir, "prompt.txt"), prompt)
    fs.writeFileSync(path.join(dir, "latest.json"), response?.message || "")
    fs.writeFileSync(
      path.join(dir, `${Date.now()}.json`),
      response?.message || ""
    )
  }

  const json = JSON.parse(response!.message || "") as {
    structure: Table[]
    data: Record<string, any[]>
  }
  const createdTables: GenerateTablesResponse["createdTables"] = []

  for (const table of json.structure) {
    const createTableCtx = {
      request: {
        body: {
          ...table,
          sourceId: dsId,
          schema: {},
          primaryDisplay: undefined,
        },
      },
      user: ctx.user,
      throw: ctx.throw,
    } as any
    await tableController.create(createTableCtx, async () => {})
    const createdTable = createTableCtx.body
    createdTables.push({ id: createdTable._id, name: createdTable.name })
    table._id = createdTable._id
  }

  for (const table of json.structure) {
    for (const fieldKey of Object.keys(table.schema).filter(
      f => table.schema[f].type === FieldType.LINK
    )) {
      const field = table.schema[fieldKey] as RelationshipFieldMetadata
      const linkedTable = createdTables.find(t => t.name === field.tableId)
      if (!linkedTable) {
        throw `Table ${field.tableId} not found in the json response.`
      }
      field.tableId = linkedTable.id
    }
  }

  for (const table of json.structure) {
    const readTableCtx = {
      params: { tableId: table._id },
      user: ctx.user,
      throw: ctx.throw,
    } as any

    await tableController.read(readTableCtx, async () => {})

    const updateTableCtx = {
      request: {
        body: {
          ...readTableCtx.body,
          schema: {
            ...readTableCtx.body.schema,
            ...table.schema,
          },
          primaryDisplay: table.primaryDisplay,
        },
      },
      params: { tableId: table._id },
      user: ctx.user,
      throw: ctx.throw,
    } as any
    await tableController.update(updateTableCtx, async () => {})
  }

  if (addData) {
    for (const table of json.structure) {
      const dataToAdd = json.data?.[table.name]
      for (const entry of dataToAdd || []) {
        await sdk.rows.save(
          table._id!,
          {
            ...entry,
          },
          ctx.user._id
        )
      }
    }
  }

  ctx.body = {
    response: response?.message ?? undefined,
    createdTables,
  }
}

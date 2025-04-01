import {
  DocumentType,
  FieldType,
  GenerateTablesRequest,
  GenerateTablesResponse,
  SourceName,
  TableSchema,
  TableSourceType,
  UserCtx,
} from "@budibase/types"
import { getLLM } from "packages/pro/src/ai"
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

  const response = await llm!.generateTables(
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

  if (!useCached) {
    const dir = path.join(process.env.PWD!, `../../llm-output/${cacheKey}`)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    fs.writeFileSync(path.join(dir, "prompt.txt"), prompt)
    fs.writeFileSync(path.join(dir, "latest.json"), JSON.stringify(response))
    fs.writeFileSync(
      path.join(dir, `${Date.now()}.json`),
      JSON.stringify(response)
    )
  }

  const createdTables: GenerateTablesResponse["createdTables"] = []

  for (const table of response.tables) {
    const createdTable = await sdk.tables.create({
      ...table.structure,
      sourceId: dsId,
      schema: {},
      primaryDisplay: undefined,
      sourceType: TableSourceType.INTERNAL,
      type: "table",
    })

    createdTables.push({ id: createdTable._id!, name: createdTable.name })
    table.structure._id = createdTable._id!
  }

  for (const table of Object.values(response.tables)) {
    for (const field of table.structure.schema.filter(
      f => f.type === FieldType.LINK
    )) {
      // const field =  table.schema[fieldKey] as RelationshipFieldMetadata
      const linkedTable = createdTables.find(t => t.name === field.tableId)
      if (!linkedTable) {
        throw `Table ${field.tableId} not found in the json response.`
      }
      field.tableId = linkedTable.id
    }
  }

  for (const { structure: table } of Object.values(response.tables)) {
    const storedTable = await sdk.tables.getTable(table._id)

    await sdk.tables.update({
      ...storedTable,
      schema: {
        ...storedTable.schema,
        ...table.schema.reduce<TableSchema>((acc, field) => {
          acc[field.name] = field
          return acc
        }, {}),
      },
      primaryDisplay: table.primaryDisplay,
    })
  }

  if (addData) {
    const createdData: Record<string, Record<string, string>> = {}
    const toUpdateLinks: {
      tableId: string
      rowId: string
      data: Record<string, { rowId: string; tableId: string }>
    }[] = []
    for (const table of Object.values(response.tables)) {
      const linksOverride: Record<string, null> = {}
      for (const field of table.structure.schema.filter(
        f => f.type === FieldType.LINK
      )) {
        linksOverride[field.name] = null
      }

      for (const entry of table.data || []) {
        const createdRow = await sdk.rows.save(
          table.structure._id,
          {
            ...entry.values.reduce<Record<string, any>>((acc, v) => {
              acc[v.key] = v.value
              return acc
            }, {}),
            ...linksOverride,
            _id: undefined,
          },
          ctx.user._id
        )

        createdData[table.structure._id] ??= {}
        createdData[table.structure._id][entry.id] = createdRow.row._id!

        const overridenLinks = Object.keys(linksOverride).reduce<
          Record<string, { rowId: string; tableId: string }>
        >((acc, l) => {
          if (entry.values.find(f => f.key === l)) {
            acc[l] = {
              tableId: (table.structure.schema.find(f => f.name === l) as any)
                .tableId,
              rowId: entry.id,
            }
          }
          return acc
        }, {})

        if (Object.keys(overridenLinks)) {
          toUpdateLinks.push({
            tableId: createdRow.table._id!,
            rowId: createdRow.row._id!,
            data: overridenLinks,
          })
        }
      }
    }

    //   for (const data of toUpdateLinks.filter(d => Object.keys(d.data).length)) {
    //     const persistedRow = await sdk.rows.find(data.tableId, data.rowId)

    //     const updatedLinks = Object.keys(data.data).reduce<
    //       Record<string, string>
    //     >((acc, d) => {
    //       acc[d] = createdData[data.data[d].tableId][data.data[d].rowId]
    //       return acc
    //     }, {})

    //     await sdk.rows.save(
    //       data.tableId,
    //       {
    //         ...persistedRow,
    //         ...updatedLinks,
    //       },
    //       ctx.user._id
    //     )
    //   }
  }

  ctx.body = {
    createdTables,
  }
}

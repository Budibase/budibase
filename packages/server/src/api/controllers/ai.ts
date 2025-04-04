import * as uuid from "uuid"
import {
  DocumentType,
  FieldType,
  GenerateTablesRequest,
  GenerateTablesResponse,
  SourceName,
  TableSchema,
  TableSourceType,
  Upload,
  UserCtx,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import { context, objectStore, utils } from "@budibase/backend-core"
import sdk from "../../sdk"
import fs, { mkdirSync } from "fs"
import path, { join } from "path"

import { pipeline } from "stream"
import { promisify } from "util"
import fetch from "node-fetch"
import { ObjectStoreBuckets } from "../../constants"

async function generateTablesDelegate(
  data: ai.GenerationStructure,
  addData: boolean,
  userId: string
) {
  const count = (await sdk.datasources.fetch()).length
  const { id: dsId } = await context.getAppDB().put({
    _id: `${DocumentType.DATASOURCE}_bb_internal_${utils.newid()}`,
    name: `Test ${count}`,
    type: "budibase",

    source: SourceName.BUDIBASE,
    config: {},
  })

  const createdTables: GenerateTablesResponse["createdTables"] = []
  const tableIds: Record<string, string> = {}

  for (const table of data.tables) {
    const createdTable = await sdk.tables.create({
      ...table.structure,
      sourceId: dsId,
      schema: {},
      primaryDisplay: undefined,
      sourceType: TableSourceType.INTERNAL,
      type: "table",
    })

    createdTables.push({ id: createdTable._id!, name: createdTable.name })
    tableIds[table.structure.name] = createdTable._id!
  }

  for (const table of Object.values(data.tables)) {
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

    for (const field of table.structure.schema.filter(
      f => f.type === FieldType.FORMULA
    )) {
      field.formula = `{{ js "${btoa(field.formula)}" }}`
    }
  }

  for (const { structure: table } of Object.values(data.tables)) {
    const storedTable = await sdk.tables.getTable(tableIds[table.name])

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
    for (const table of Object.values(data.tables)) {
      const linksOverride: Record<string, null> = {}
      for (const field of table.structure.schema.filter(
        f => f.type === FieldType.LINK
      )) {
        linksOverride[field.name] = null
      }

      const attachmentColumns = table.structure.schema.filter(
        f => f.type === FieldType.ATTACHMENT_SINGLE
      )

      for (const entry of table.data || []) {
        const tableId = tableIds[table.structure.name]

        const attachmentData: Record<string, any> = {}
        for (const column of attachmentColumns) {
          const attachment = await downloadFile(
            entry.values.find(f => f.key === column.name)!.value as string
          )
          attachmentData[column.name] = attachment
        }

        const createdRow = await sdk.rows.save(
          tableId,
          {
            ...entry.values.reduce<Record<string, any>>((acc, v) => {
              acc[v.key] = v.value
              return acc
            }, {}),
            ...linksOverride,
            ...attachmentData,
            _id: undefined,
          },
          userId
        )

        createdData[tableId] ??= {}
        createdData[tableId][entry.id] = createdRow.row._id!

        const overridenLinks = Object.keys(linksOverride).reduce<
          Record<string, { rowId: string; tableId: string }>
        >((acc, l) => {
          if (entry.values.find(f => f.key === l)) {
            acc[l] = {
              tableId: (table.structure.schema.find(f => f.name === l) as any)
                .tableId,
              rowId: entry.values.find(f => f.key === l)!.value as any,
            }
          }
          return acc
        }, {})

        if (Object.keys(overridenLinks).length) {
          toUpdateLinks.push({
            tableId: createdRow.table._id!,
            rowId: createdRow.row._id!,
            data: overridenLinks,
          })
        }
      }
    }

    for (const data of toUpdateLinks) {
      const persistedRow = await sdk.rows.find(data.tableId, data.rowId)

      const updatedLinks = Object.keys(data.data).reduce<
        Record<string, string>
      >((acc, d) => {
        acc[d] = createdData[data.data[d].tableId][data.data[d].rowId]
        return acc
      }, {})

      await sdk.rows.save(
        data.tableId,
        {
          ...persistedRow,
          ...updatedLinks,
        },
        userId
      )
    }
  }

  return createdTables
}

export async function generateTables(
  ctx: UserCtx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const { prompt, useCached, addData } = ctx.request.body

  const llm = await ai.getLLM("gpt-4o")
  if (!llm) {
    ctx.throw("LLM not available")
  }
  llm.maxTokens = 5000

  const createdTables = await llm!.generateTables(
    prompt,
    useCached,
    addData,
    ctx.userId,
    generateTablesDelegate
  )

  ctx.body = {
    createdTables,
  }
}

async function downloadFile(url: string): Promise<Upload> {
  const res = await fetch(url)

  const tmpPath = join(objectStore.budibaseTempDir(), "ai-downloads")

  if (!fs.existsSync(tmpPath)) {
    mkdirSync(tmpPath)
  }

  const extension = [...res.url.split(".")].pop()!.split("?")[0]

  const destination = path.resolve(tmpPath, `${uuid.v4()}${extension}`)
  const fileStream = fs.createWriteStream(destination, { flags: "wx" })

  await promisify(pipeline)(res.body, fileStream)

  const processedFileName = path.basename(destination)

  const s3Key = `${context.getProdAppId()}/attachments/${processedFileName}`

  const response = await objectStore.upload({
    bucket: ObjectStoreBuckets.APPS,
    filename: s3Key,
    path: destination,
    type: "image/jpeg",
  })

  return {
    size: fileStream.bytesWritten,
    name: processedFileName,
    url: await objectStore.getAppFileUrl(s3Key),
    extension,
    key: response.Key!,
  }
}

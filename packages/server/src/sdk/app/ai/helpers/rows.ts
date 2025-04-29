import { FieldSchema, FieldType, TableSchema } from "@budibase/types"
import sdk from "../../.."
import { uploadFile, uploadUrl } from "../../../../utilities"

export async function generateRows(
  data: Record<string, Record<string, any>[]>,
  userId: string,
  tables: Record<string, { _id: string; schema: TableSchema }>
) {
  const createdData: Record<string, Record<string, string>> = {}
  const toUpdateLinks: {
    tableId: string
    rowId: string
    data: Record<string, { rowId: string[]; tableId: string }>
  }[] = []

  const rowPromises = []

  for (const tableName of Object.keys(data)) {
    const table = tables[tableName]
    const linksOverride: Record<string, null> = {}
    for (const field of Object.values(table.schema).filter(
      f => f.type === FieldType.LINK
    )) {
      linksOverride[field.name] = null
    }

    const attachmentColumns = Object.values(table.schema).filter(f =>
      [FieldType.ATTACHMENTS, FieldType.ATTACHMENT_SINGLE].includes(f.type)
    )

    rowPromises.push(
      ...data[tableName].map(async entry => {
        await processAttachments(entry, attachmentColumns)

        const tableId = table._id!
        const createdRow = await sdk.rows.save(
          tableId,
          {
            ...entry,
            ...linksOverride,
            _id: undefined,
          },
          userId
        )

        createdData[tableId] ??= {}
        createdData[tableId][entry._id] = createdRow.row._id!

        const overridenLinks = Object.keys(linksOverride).reduce<
          Record<string, { rowId: string[]; tableId: string }>
        >((acc, l) => {
          if (entry[l]) {
            acc[l] = {
              tableId: (table.schema[l] as any).tableId,
              rowId: entry[l],
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
      })
    )
  }

  await Promise.all(rowPromises)

  await Promise.all(
    toUpdateLinks.map(async data => {
      const persistedRow = await sdk.rows.find(data.tableId, data.rowId)

      const updatedLinks = Object.keys(data.data).reduce<Record<string, any>>(
        (acc, d) => {
          acc[d] = [
            ...(persistedRow[d] || []),
            ...data.data[d].rowId.map(
              rid => createdData[data.data[d].tableId][rid]
            ),
          ]
          return acc
        },
        {}
      )

      await sdk.rows.save(
        data.tableId,
        {
          ...persistedRow,
          ...updatedLinks,
        },
        userId,
        { updateAIColumns: false }
      )
    })
  )
}
async function processAttachments(
  entry: Record<string, any>,
  attachmentColumns: FieldSchema[]
) {
  function processAttachment(value: any) {
    if (typeof value === "object") {
      return uploadFile(value)
    }

    return uploadUrl(value)
  }

  for (const column of attachmentColumns) {
    if (!Array.isArray(entry[column.name])) {
      entry[column.name] = await processAttachment(entry[column.name])
    } else {
      entry[column.name] = await Promise.all(
        entry[column.name].map((attachment: any) =>
          processAttachment(attachment)
        )
      )
    }
  }
}

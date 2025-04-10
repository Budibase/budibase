import { FieldType, Table } from "@budibase/types"
import sdk from "../../.."
import { uploadFile, uploadUrl } from "../../../../utilities"

export async function generateRows(
  data: Record<string, Record<string, any>[]>,
  userId: string,
  tables: Record<string, Table>
) {
  const createdData: Record<string, Record<string, string>> = {}
  const toUpdateLinks: {
    tableId: string
    rowId: string
    data: Record<string, { rowId: string[]; tableId: string }>
  }[] = []
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

    for (const entry of data[tableName]) {
      const attachmentData: Record<string, any> = {}
      for (const column of attachmentColumns) {
        attachmentData[column.name] = []
        if (!Array.isArray(entry[column.name])) {
          entry[column.name] = [entry[column.name]]
        }
        for (const attachmentValue of entry[column.name]) {
          let attachment
          if (typeof attachmentValue === "object") {
            attachment = await uploadFile(attachmentValue)
          } else {
            attachment = await uploadUrl(attachmentValue)
          }
          if (attachment) {
            attachmentData[column.name].push(attachment)
          }
        }

        if (column.type === FieldType.ATTACHMENT_SINGLE) {
          attachmentData[column.name] = attachmentData[column.name][0]
        }
      }

      const tableId = tables[tableName]._id!
      const createdRow = await sdk.rows.save(
        tableId,
        {
          ...entry,
          ...linksOverride,
          ...attachmentData,
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
    }
  }

  for (const data of toUpdateLinks) {
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
      userId
    )
  }
}

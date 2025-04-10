import {
  DocumentType,
  FieldType,
  GenerateTablesResponse,
  SourceName,
  TableSchema,
  TableSourceType,
} from "@budibase/types"
import sdk from "../../.."
import { context, utils } from "@budibase/backend-core"

export async function generateTables(
  tables: { name: string; primaryDisplay: string; schema: TableSchema }[]
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

  for (const table of tables) {
    const createdTable = await sdk.tables.create({
      ...table,
      sourceId: dsId,
      schema: {},
      primaryDisplay: undefined,
      sourceType: TableSourceType.INTERNAL,
      type: "table",
    })

    createdTables.push({ id: createdTable._id!, name: createdTable.name })
    tableIds[table.name] = createdTable._id!
  }

  for (const table of tables) {
    for (const field of Object.values(table.schema)) {
      if (field.type === FieldType.LINK) {
        const linkedTable = createdTables.find(t => t.name === field.tableId)
        if (!linkedTable) {
          throw `Table ${field.tableId} not found in the json response.`
        }
        field.tableId = linkedTable.id
      } else if (field.type === FieldType.FORMULA) {
        field.formula = `{{ js "${btoa(field.formula)}" }}`
      }
    }
  }

  for (const table of tables) {
    const storedTable = await sdk.tables.getTable(tableIds[table.name])

    await sdk.tables.update({
      ...storedTable,
      schema: {
        ...storedTable.schema,
        ...table.schema,
      },
      primaryDisplay: table.primaryDisplay,
    })
  }

  return createdTables
}

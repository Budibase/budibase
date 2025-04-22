import {
  FieldType,
  GenerateTablesResponse,
  INTERNAL_TABLE_SOURCE_ID,
  TableSchema,
  TableSourceType,
} from "@budibase/types"
import sdk from "../../.."
import { helpers } from "@budibase/shared-core"

export async function generateTables(
  tables: { name: string; primaryDisplay: string; schema: TableSchema }[]
) {
  const createdTables: GenerateTablesResponse["createdTables"] = []
  const tableIds: Record<string, string> = {}

  try {
    for (const table of tables) {
      for (const linkField of Object.values(table.schema).filter(
        f => f.type === FieldType.LINK
      )) {
        if (!tables.find(t => t.name === linkField.tableId)) {
          throw `Table ${linkField.tableId} not found in the json response.`
        }
      }
    }

    const existingTableNames = (await sdk.tables.getAllInternalTables()).map(
      t => t.name
    )

    for (const table of tables) {
      const name = helpers.getSequentialName(existingTableNames, table.name, {
        separator: " ",
      })
      const createdTable = await sdk.tables.create({
        ...table,
        name,
        schema: {},
        primaryDisplay: undefined,
        sourceType: TableSourceType.INTERNAL,
        sourceId: INTERNAL_TABLE_SOURCE_ID,
        type: "table",
      })

      createdTables.push({ id: createdTable._id!, name: table.name })
      tableIds[table.name] = createdTable._id!
    }

    for (const table of tables) {
      for (const field of Object.values(table.schema)) {
        if (field.type === FieldType.LINK) {
          field.tableId = tableIds[field.tableId]
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
  } catch (e) {
    const tables = await sdk.tables.getTables(createdTables.map(t => t.id))
    await Promise.all(tables.map(sdk.tables.internal.destroy))

    throw e
  }

  return createdTables
}

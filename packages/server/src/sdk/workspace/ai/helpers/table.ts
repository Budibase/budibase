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
          throw new Error(
            `Table ${linkField.tableId} not found in the json response.`
          )
        }
        if (linkField.tableId === table.name) {
          throw new Error(
            `Self-referential relationships are not supported. Table ${table.name} cannot link to itself.`
          )
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
        aiGenerated: true,
      })

      createdTables.push({ id: createdTable._id!, name: table.name })
      tableIds[table.name] = createdTable._id!
    }

    for (const table of tables) {
      for (const field of Object.values(table.schema)) {
        if (field.type === FieldType.LINK) {
          field.tableId = tableIds[field.tableId]
        } else if (field.type === FieldType.FORMULA) {
          // There seems to be an intermittent issue with openai returning unicode characters that
          // btoa cannot handle at all.
          field.formula = `{{ js "${Buffer.from(field.formula).toString("base64")}" }}`
        }
      }
    }

    for (const table of tables) {
      const storedTable = await sdk.tables.getTable(tableIds[table.name])
      const schema = {
        ...storedTable.schema,
        ...table.schema,
      }

      for (const field of Object.keys(schema)) {
        schema[field].aiGenerated = true
      }

      await sdk.tables.update({
        ...storedTable,
        schema,
        primaryDisplay: table.primaryDisplay,
      })
    }
  } catch (e) {
    console.log("Error generating tables, cleaning up created tables", e)
    const tables = await sdk.tables.getTables(createdTables.map(t => t.id))
    await Promise.all(tables.map(sdk.tables.internal.destroy))

    throw e
  }

  return createdTables
}

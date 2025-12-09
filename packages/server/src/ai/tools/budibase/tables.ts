import { z } from "zod"
import { newTool } from ".."
import sdk from "../../../sdk"

export default [
  newTool({
    name: "list_tables",
    description: "List all tables in the current app",
    parameters: z.object({
      showSchema: z
        .boolean()
        .describe(
          "Whether to show the schema of the tables. This can be extemely large. Default to false to save on tokens."
        )
        .default(false),
    }),
    handler: async ({ showSchema }) => {
      const tables = await sdk.tables.getAllTables()
      if (!showSchema) {
        return {
          tables: tables.map(table => ({
            id: table._id!,
            tableName: table.name,
          })),
        }
      }
      return { tables }
    },
  }),

  newTool({
    name: "get_table",
    description: "Get details about a specific table by ID",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table to retrieve"),
    }),
    handler: async ({ tableId }: { tableId: string }) => {
      const table = await sdk.tables.getTable(tableId)
      return { table }
    },
  }),
]

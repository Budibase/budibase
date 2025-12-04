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
      let tables = await sdk.tables.getAllTables()
      let formattedTables: { id: string; tableName: string }[] = []
      if (!showSchema) {
        formattedTables = tables.map(table => {
          return {
            id: table._id!,
            tableName: table.name,
          }
        })
      }
      const formatted = JSON.stringify(
        formattedTables.length ? formattedTables : tables,
        null,
        2
      )
      return `Here are the tables in the current app:\n\n${formatted}`
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
      const formatted = JSON.stringify(table, null, 2)
      return `Here are the details for table ${tableId}:\n\n${formatted}`
    },
  }),
]

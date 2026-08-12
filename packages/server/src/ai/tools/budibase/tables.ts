import { ToolType } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."
import { sanitizeAgentTable } from "./tableScope"

export const createTableTools = (
  tableIds: string[]
): BudibaseToolDefinition[] => {
  const allowedTableIds = [...new Set(tableIds)]
  const allowedTableIdSet = new Set(allowedTableIds)

  return [
    {
      name: "list_tables",
      sourceType: ToolType.INTERNAL_TABLE,
      sourceLabel: "Budibase",
      description: "List tables configured for the current operation",
      tool: tool({
        description: "List tables configured for the current operation",
        inputSchema: z.object({
          showSchema: z
            .boolean()
            .describe(
              "Whether to show the schema of the tables. This can be extemely large. Default to false to save on tokens."
            )
            .default(false),
        }),

        execute: async input => {
          const { showSchema } = input
          const tables = await sdk.tables.getTables(allowedTableIds)
          if (!showSchema) {
            return {
              tables: tables.map(table => ({
                id: table._id!,
                tableName: table.name,
              })),
            }
          }
          return { tables: tables.map(sanitizeAgentTable) }
        },
      }),
    },

    {
      name: "get_table",
      sourceType: ToolType.INTERNAL_TABLE,
      sourceLabel: "Budibase",
      description: "Get details about a specific table by ID",
      tool: tool({
        description: "Get details about a specific table by ID",
        inputSchema: z.object({
          tableId: z.string().describe("The ID of the table to retrieve"),
        }),
        execute: async input => {
          const { tableId } = input
          if (!allowedTableIdSet.has(tableId)) {
            throw new Error("Table is not configured for the current operation")
          }
          const table = await sdk.tables.getTable(tableId)
          return { table: sanitizeAgentTable(table) }
        },
      }),
    },
  ]
}

import {
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
  ToolType,
} from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."

const TABLE_TOOLS: BudibaseToolDefinition[] = [
  {
    name: "list_tables",
    sourceType: ToolType.INTERNAL_TABLE,
    sourceLabel: "Budibase",
    description: "List all tables in the current workspace",
    authorization: {
      supportedPrincipals: [ToolExecutionPrincipal.REQUESTER],
      permissionType: PermissionType.WORKSPACE,
      permissionLevel: PermissionLevel.READ,
    },
    tool: tool({
      description: "List all tables in the current workspace",
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
  },

  {
    name: "get_table",
    sourceType: ToolType.INTERNAL_TABLE,
    sourceLabel: "Budibase",
    description: "Get details about a specific table by ID",
    authorization: {
      supportedPrincipals: [ToolExecutionPrincipal.REQUESTER],
      permissionType: PermissionType.TABLE,
      permissionLevel: PermissionLevel.READ,
      resolveResourceId: input =>
        typeof input === "object" && input && "tableId" in input
          ? String(input.tableId)
          : undefined,
    },
    tool: tool({
      description: "Get details about a specific table by ID",
      inputSchema: z.object({
        tableId: z.string().describe("The ID of the table to retrieve"),
      }),
      execute: async input => {
        const { tableId } = input
        const table = await sdk.tables.getTable(tableId)
        return { table }
      },
    }),
  },
]

export default TABLE_TOOLS

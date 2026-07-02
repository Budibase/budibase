import { ToolType, View, ViewV2 } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import { helpers } from "@budibase/shared-core"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."

type ViewV2WithRowCount = ViewV2 & { rowCount?: number }

const getViewRowCount = async (view: ViewV2): Promise<number> => {
  const result = await sdk.rows.search({
    tableId: view.tableId,
    viewId: view.id,
    query: {},
    countRows: true,
    limit: 1,
  })
  return result.totalRows ?? 0
}

const enrichViewsWithRowCounts = async (
  views: Record<string, View | ViewV2> | undefined
): Promise<Record<string, View | ViewV2WithRowCount> | undefined> => {
  if (!views) {
    return views
  }
  const entries = await Promise.all(
    Object.entries(views).map(async ([name, view]) => {
      if (!helpers.views.isV2(view)) {
        return [name, view] as const
      }
      try {
        const rowCount = await getViewRowCount(view)
        return [name, { ...view, rowCount }] as const
      } catch {
        // A single failing view count must not break table inspection
        return [name, { ...view, rowCount: undefined }] as const
      }
    })
  )
  return Object.fromEntries(entries)
}

const TABLE_TOOLS: BudibaseToolDefinition[] = [
  {
    name: "list_tables",
    sourceType: ToolType.INTERNAL_TABLE,
    sourceLabel: "Budibase",
    description: "List all tables in the current app",
    tool: tool({
      description: "List all tables in the current app",
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
    description:
      "Get details about a specific table by ID, including its views and the " +
      "current record count (rowCount) of each view",
    tool: tool({
      description:
        "Get details about a specific table by ID, including its views and the " +
        "current record count (rowCount) of each view",
      inputSchema: z.object({
        tableId: z.string().describe("The ID of the table to retrieve"),
      }),
      execute: async input => {
        const { tableId } = input
        const table = await sdk.tables.getTable(tableId)
        const views = await enrichViewsWithRowCounts(table.views)
        return { table: { ...table, views } }
      },
    }),
  },
]

export default TABLE_TOOLS

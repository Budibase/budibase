import { newTool } from "@budibase/types"
import sdk from "../../../sdk"
import { z } from "zod"

export default [
  newTool({
    name: "list_rows",
    description: "List rows in a given table",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table to list rows from"),
    }),
    handler: async ({ tableId }) => {
      const rows = await sdk.rows.fetch(tableId)
      const formatted = JSON.stringify(rows, null, 2)
      return `Here are the rows for table ${tableId}:\n\n${formatted}`
    },
  }),
]

import { newTool } from "@budibase/types"
import sdk from "../../../sdk"

export default [
  newTool({
    name: "list_tables",
    description: "List all tables in the current app",
    handler: async () => {
      const tables = await sdk.tables.getAllTables()
      const formatted = JSON.stringify(tables, null, 2)
      return `Here are the tables in the current app:\n\n${formatted}`
    },
  }),
]

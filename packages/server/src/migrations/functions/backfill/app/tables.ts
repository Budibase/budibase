import { events } from "@budibase/backend-core"
import { Database } from "@budibase/types"
import sdk from "../../../../sdk"

export const backfill = async (appDb: Database, timestamp: string | number) => {
  const tables = await sdk.tables.getAllInternalTables(appDb)

  for (const table of tables) {
    await events.table.created(table, timestamp)
  }

  return tables.length
}

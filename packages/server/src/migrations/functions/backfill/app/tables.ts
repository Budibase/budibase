import { events } from "@budibase/backend-core"
import { Database } from "@budibase/types"
import sdk from "../../../../sdk"

export const backfill = async (appDb: Database, timestamp: string | number) => {
  const tables = await sdk.tables.getAllInternalTables(appDb)

  for (const table of tables) {
    await events.table.created(table, timestamp)

    if (table.views) {
      for (const view of Object.values(table.views)) {
        if (sdk.views.isV2(view)) {
          continue
        }

        await events.view.created(view, timestamp)

        if (view.calculation) {
          await events.view.calculationCreated(view, timestamp)
        }

        if (view.filters?.length) {
          await events.view.filterCreated(view, timestamp)
        }
      }
    }
  }

  return tables.length
}

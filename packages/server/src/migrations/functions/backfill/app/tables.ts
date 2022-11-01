import { events } from "@budibase/backend-core"
import sdk from "../../../../sdk"
import PouchDB from "pouchdb"

export const backfill = async (
  appDb: PouchDB.Database,
  timestamp: string | number
) => {
  const tables = await sdk.tables.getAllInternalTables(appDb)

  for (const table of tables) {
    await events.table.created(table, timestamp)

    if (table.views) {
      for (const view of Object.values(table.views)) {
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

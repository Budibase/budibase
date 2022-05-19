import { events, db } from "@budibase/backend-core"
import { getTableParams } from "../../../../db/utils"
import { Table } from "@budibase/types"

const getTables = async (appDb: any): Promise<Table[]> => {
  const response = await appDb.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (appDb: any) => {
  if (db.isDevAppID(appDb.name)) {
    const tables = await getTables(appDb)

    for (const table of tables) {
      events.table.created(table)
    }
  }
}

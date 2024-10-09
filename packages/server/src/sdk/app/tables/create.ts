import { Row, Table } from "@budibase/types"

// import * as external from "./external"
import * as internal from "./internal"
import { isExternal } from "./utils"

export async function create(
  table: Omit<Table, "_id" | "_rev">,
  rows?: Row[],
  userId?: string
): Promise<Table> {
  if (isExternal({ table })) {
    // const datasourceId = table.sourceId!
    throw "not implemented"
    // return await external.create(table, rows, userId)
  }
  return await internal.create(table, rows, userId)
}

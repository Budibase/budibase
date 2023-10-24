import { Table, RenameColumn } from "@budibase/types"
import { isExternalTable } from "../../../integrations/utils"
import sdk from "../../index"
import { context } from "@budibase/backend-core"
import { isExternal } from "./utils"

import * as external from "./external"
import * as internal from "./internal"
export * as external from "./external"
export * as internal from "./internal"

export async function saveTable(table: Table) {
  const db = context.getAppDB()
  if (isExternalTable(table._id!)) {
    const datasource = await sdk.datasources.get(table.sourceId!)
    datasource.entities![table.name] = table
    await db.put(datasource)
  } else {
    await db.put(table)
  }
}

export async function update(table: Table, renaming?: RenameColumn) {
  const tableId = table._id
  if (isExternal({ table })) {
    const datasourceId = table.sourceId!
    await external.save(datasourceId, table, { tableId, renaming })
  } else {
    await internal.save(table, { tableId, renaming })
  }
}

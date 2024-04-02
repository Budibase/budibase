import { Table, RenameColumn } from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import sdk from "../../index"
import { context } from "@budibase/backend-core"
import { isExternal } from "./utils"
import { DocumentInsertResponse } from "@budibase/nano"

import * as external from "./external"
import * as internal from "./internal"
import { cloneDeep } from "lodash"

export * as external from "./external"
export * as internal from "./internal"

export async function saveTable(table: Table): Promise<Table> {
  const db = context.getAppDB()
  let resp: DocumentInsertResponse
  if (isExternalTableID(table._id!)) {
    const datasource = await sdk.datasources.get(table.sourceId!)
    datasource.entities![table.name] = table
    resp = await db.put(datasource)
  } else {
    resp = await db.put(table)
  }

  let tableClone = cloneDeep(table)
  tableClone._rev = resp.rev
  return tableClone
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

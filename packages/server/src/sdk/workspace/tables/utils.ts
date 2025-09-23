import { Table, TableSourceType } from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import { isTableIdOrExternalTableId } from "@budibase/shared-core"

export function isExternal(opts: { table?: Table; tableId?: string }): boolean {
  if (opts.table && opts.table.sourceType === TableSourceType.EXTERNAL) {
    return true
  } else if (opts.tableId && isExternalTableID(opts.tableId)) {
    return true
  }
  return false
}

export function isInternal(opts: { table?: Table; tableId?: string }): boolean {
  return !isExternal(opts)
}

export function isTable(table: any): table is Table {
  return table._id && isTableIdOrExternalTableId(table._id)
}

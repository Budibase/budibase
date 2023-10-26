import { Table, TableSourceType } from "@budibase/types"
import { isExternalTable } from "../../../integrations/utils"

export function isExternal(opts: { table?: Table; tableId?: string }): boolean {
  if (opts.table && opts.table.sourceType === TableSourceType.EXTERNAL) {
    return true
  } else if (opts.tableId && isExternalTable(opts.tableId)) {
    return true
  }
  return false
}

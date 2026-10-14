import { Table, TableSourceType } from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import {
  isAllowedDisplayField,
  isTableIdOrExternalTableId,
} from "@budibase/shared-core"

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

// A dangling reference breaks view creation, so re-point it to another eligible column,
// or remove it if there is none.
export function ensureValidPrimaryDisplay(table: Table) {
  if (!table.primaryDisplay || table.schema[table.primaryDisplay]) {
    return
  }
  const fallback = Object.keys(table.schema).find(name =>
    isAllowedDisplayField(name, table.schema[name].type)
  )
  if (fallback) {
    table.primaryDisplay = fallback
  } else {
    delete table.primaryDisplay
  }
}

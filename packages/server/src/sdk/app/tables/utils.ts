import { FieldType, Table, TableSourceType } from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import { docIds, HTTPError } from "@budibase/backend-core"

export function isExternal(opts: { table?: Table; tableId?: string }): boolean {
  if (opts.table && opts.table.sourceType === TableSourceType.EXTERNAL) {
    return true
  } else if (opts.tableId && isExternalTableID(opts.tableId)) {
    return true
  }
  return false
}

export function isTable(table: any): table is Table {
  return table._id && docIds.isTableId(table._id)
}

export function checkLinkFields(table: Table) {
  for (const key of Object.keys(table.schema)) {
    const schema = table.schema[key]
    if (schema.type !== FieldType.LINK) {
      continue
    }

    const fieldNameSchema = table.schema[schema.fieldName]
    if (fieldNameSchema !== undefined) {
      throw new HTTPError(
        `Cannot use "${schema.fieldName}" as a field name for a link field, it is already used as a field name on the table`,
        400
      )
    }
  }
}

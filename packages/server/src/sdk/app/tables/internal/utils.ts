import { Table } from "@budibase/types"
import { fixAutoColumnSubType } from "../../../../utilities/rowProcessor"

export function checkAutoColumns(table: Table, oldTable?: Table) {
  if (!table.schema) {
    return table
  }
  for (let [key, schema] of Object.entries(table.schema)) {
    if (!schema.autocolumn || schema.subtype) {
      continue
    }
    const oldSchema = oldTable && oldTable.schema[key]
    if (oldSchema && oldSchema.subtype) {
      table.schema[key].subtype = oldSchema.subtype
    } else {
      table.schema[key] = fixAutoColumnSubType(schema)
    }
  }
  return table
}

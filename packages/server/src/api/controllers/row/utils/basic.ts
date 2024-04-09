// need to handle table name + field or just field, depending on if relationships used
import { FieldType, Row, Table } from "@budibase/types"
import { generateRowIdField } from "../../../../integrations/utils"

function extractFieldValue({
  row,
  tableName,
  fieldName,
  isLinked,
}: {
  row: Row
  tableName: string
  fieldName: string
  isLinked: boolean
}) {
  let value = row[`${tableName}.${fieldName}`]
  if (value == null && !isLinked) {
    value = row[fieldName]
  }
  return value
}

export function generateIdForRow(
  row: Row | undefined,
  table: Table,
  isLinked: boolean = false
): string {
  const primary = table.primary
  if (!row || !primary) {
    return ""
  }
  // build id array
  let idParts = []
  for (let field of primary) {
    let fieldValue = extractFieldValue({
      row,
      tableName: table.name,
      fieldName: field,
      isLinked,
    })
    if (fieldValue != null) {
      idParts.push(fieldValue)
    }
  }
  if (idParts.length === 0) {
    return ""
  }
  return generateRowIdField(idParts)
}

export function basicProcessing({
  row,
  table,
  isLinked,
  internal,
}: {
  row: Row
  table: Table
  isLinked: boolean
  internal?: boolean
}): Row {
  const thisRow: Row = {}
  // filter the row down to what is actually the row (not joined)
  for (let field of Object.values(table.schema)) {
    const fieldName = field.name
    const value = extractFieldValue({
      row,
      tableName: table.name,
      fieldName,
      isLinked,
    })
    // all responses include "select col as table.col" so that overlaps are handled
    if (value != null) {
      thisRow[fieldName] = value
    }
  }
  if (!internal) {
    thisRow._id = generateIdForRow(row, table, isLinked)
    thisRow.tableId = table._id
    thisRow._rev = "rev"
  }
  return thisRow
}

export function fixArrayTypes(row: Row, table: Table) {
  for (let [fieldName, schema] of Object.entries(table.schema)) {
    if (schema.type === FieldType.ARRAY && typeof row[fieldName] === "string") {
      try {
        row[fieldName] = JSON.parse(row[fieldName])
      } catch (err) {
        // couldn't convert back to array, ignore
        delete row[fieldName]
      }
    }
  }
  return row
}

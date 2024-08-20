// need to handle table name + field or just field, depending on if relationships used
import { FieldType, Row, Table } from "@budibase/types"
import { helpers, PROTECTED_INTERNAL_COLUMNS } from "@budibase/shared-core"
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

export function getInternalRowId(row: Row, table: Table): string {
  return extractFieldValue({
    row,
    tableName: table._id!,
    fieldName: "_id",
    isLinked: false,
  })
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
  sqs,
}: {
  row: Row
  table: Table
  isLinked: boolean
  sqs?: boolean
}): Row {
  const thisRow: Row = {}
  // filter the row down to what is actually the row (not joined)
  for (let fieldName of Object.keys(table.schema)) {
    let value = extractFieldValue({
      row,
      tableName: table.name,
      fieldName,
      isLinked,
    })
    if (value instanceof Buffer) {
      value = value.toString()
    }
    // all responses include "select col as table.col" so that overlaps are handled
    if (value != null) {
      thisRow[fieldName] = value
    }
  }
  if (!sqs) {
    thisRow._id = generateIdForRow(row, table, isLinked)
    thisRow.tableId = table._id
    thisRow._rev = "rev"
  } else {
    const columns = Object.keys(table.schema)
    for (let internalColumn of [...PROTECTED_INTERNAL_COLUMNS, ...columns]) {
      thisRow[internalColumn] = extractFieldValue({
        row,
        tableName: table._id!,
        fieldName: internalColumn,
        isLinked,
      })
    }
  }
  return thisRow
}

export function fixArrayTypes(row: Row, table: Table) {
  for (let [fieldName, schema] of Object.entries(table.schema)) {
    if (
      [FieldType.ARRAY, FieldType.BB_REFERENCE].includes(schema.type) &&
      typeof row[fieldName] === "string"
    ) {
      try {
        row[fieldName] = JSON.parse(row[fieldName])
      } catch (err) {
        if (!helpers.schema.isDeprecatedSingleUserColumn(schema)) {
          // couldn't convert back to array, ignore
          delete row[fieldName]
        }
      }
    }
  }
  return row
}

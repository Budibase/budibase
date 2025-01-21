// need to handle table name + field or just field, depending on if relationships used
import {
  FieldSchema,
  FieldType,
  Row,
  Table,
  JsonTypes,
  ViewV2,
} from "@budibase/types"
import {
  helpers,
  PROTECTED_EXTERNAL_COLUMNS,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"
import { generateRowIdField } from "../../../../integrations/utils"
import sdk from "../../../../sdk"

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
  isLinked = false
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

function fixJsonTypes(row: Row, table: Table) {
  for (let [fieldName, schema] of Object.entries(table.schema)) {
    if (JsonTypes.includes(schema.type) && typeof row[fieldName] === "string") {
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

export async function basicProcessing({
  row,
  source,
  tables,
  isLinked,
  sqs,
}: {
  row: Row
  source: Table | ViewV2
  tables: Table[]
  isLinked: boolean
  sqs?: boolean
}): Promise<Row> {
  let table: Table
  let isCalculationView = false
  if (sdk.views.isView(source)) {
    table = await sdk.views.getTable(source.id)
    isCalculationView = helpers.views.isCalculationView(source)
  } else {
    table = source
  }

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
    else if (value != null) {
      thisRow[fieldName] = value
    }
  }

  if (sdk.views.isView(source)) {
    for (const key of Object.keys(helpers.views.calculationFields(source))) {
      thisRow[key] = row[key]
    }
  }

  let columns: string[] = Object.keys(table.schema)
  if (!sqs && !isCalculationView) {
    thisRow._id = generateIdForRow(row, table, isLinked)
    thisRow.tableId = table._id
    thisRow._rev = "rev"
    columns = columns.concat(PROTECTED_EXTERNAL_COLUMNS)
  } else if (!isCalculationView) {
    columns = columns.concat(PROTECTED_EXTERNAL_COLUMNS)
    for (let internalColumn of [...PROTECTED_INTERNAL_COLUMNS, ...columns]) {
      thisRow[internalColumn] = extractFieldValue({
        row,
        tableName: table._id!,
        fieldName: internalColumn,
        isLinked,
      })
    }
  }
  for (let col of columns) {
    const schema: FieldSchema | undefined = table.schema[col]
    if (schema?.type !== FieldType.LINK) {
      continue
    }
    const relatedTable = tables.find(tbl => tbl._id === schema.tableId)
    if (!relatedTable) {
      continue
    }
    const value = extractFieldValue({
      row,
      tableName: table._id!,
      fieldName: col,
      isLinked,
    })
    const array: Row[] = Array.isArray(value)
      ? value
      : typeof value === "string"
      ? JSON.parse(value)
      : undefined
    if (array && Array.isArray(array)) {
      thisRow[col] = array
      // make sure all of them have an _id
      const sortField = relatedTable.primaryDisplay || relatedTable.primary![0]!
      thisRow[col] = (
        await Promise.all(
          (thisRow[col] as Row[]).map(relatedRow =>
            basicProcessing({
              row: relatedRow,
              source: relatedTable,
              tables,
              isLinked: false,
              sqs,
            })
          )
        )
      ).sort((a, b) => {
        const aField = a?.[sortField],
          bField = b?.[sortField]
        if (!aField) {
          return 1
        } else if (!bField) {
          return -1
        }
        return aField.localeCompare
          ? aField.localeCompare(bField)
          : aField - bField
      })
    }
  }
  return fixJsonTypes(thisRow, table)
}

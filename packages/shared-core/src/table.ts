import { FieldType, Table } from "@budibase/types"
import { CONSTANT_INTERNAL_ROW_COLS } from "./constants"

const allowDisplayColumnByType: Record<FieldType, boolean> = {
  [FieldType.STRING]: true,
  [FieldType.LONGFORM]: true,
  [FieldType.OPTIONS]: true,
  [FieldType.NUMBER]: true,
  [FieldType.DATETIME]: true,
  [FieldType.FORMULA]: true,
  [FieldType.AUTO]: true,
  [FieldType.INTERNAL]: true,
  [FieldType.BARCODEQR]: true,
  [FieldType.BIGINT]: true,
  [FieldType.BOOLEAN]: false,
  [FieldType.ARRAY]: false,
  [FieldType.ATTACHMENTS]: false,
  [FieldType.ATTACHMENT_SINGLE]: false,
  [FieldType.SIGNATURE_SINGLE]: false,
  [FieldType.LINK]: false,
  [FieldType.JSON]: false,
  [FieldType.BB_REFERENCE]: false,
  [FieldType.BB_REFERENCE_SINGLE]: false,
}

const allowSortColumnByType: Record<FieldType, boolean> = {
  [FieldType.STRING]: true,
  [FieldType.LONGFORM]: true,
  [FieldType.OPTIONS]: true,
  [FieldType.NUMBER]: true,
  [FieldType.DATETIME]: true,
  [FieldType.AUTO]: true,
  [FieldType.INTERNAL]: true,
  [FieldType.BARCODEQR]: true,
  [FieldType.BIGINT]: true,
  [FieldType.BOOLEAN]: true,
  [FieldType.JSON]: true,
  [FieldType.FORMULA]: false,
  [FieldType.ATTACHMENTS]: false,
  [FieldType.ATTACHMENT_SINGLE]: false,
  [FieldType.SIGNATURE_SINGLE]: false,
  [FieldType.ARRAY]: false,
  [FieldType.LINK]: false,
  [FieldType.BB_REFERENCE]: false,
  [FieldType.BB_REFERENCE_SINGLE]: false,
}

export function canBeDisplayColumn(type: FieldType): boolean {
  return !!allowDisplayColumnByType[type]
}

export function canBeSortColumn(type: FieldType): boolean {
  return !!allowSortColumnByType[type]
}

export function findDuplicateInternalColumns(table: Table): string | undefined {
  // get the column names
  const columnNames = Object.keys(table.schema)
    .concat(CONSTANT_INTERNAL_ROW_COLS)
    .map(colName => colName.toLowerCase())
  // there are duplicates
  const set = new Set(columnNames)
  let foundDuplicate: string | undefined
  if (set.size !== columnNames.length) {
    for (let key of set.keys()) {
      const count = columnNames.filter(name => name === key).length
      if (count > 1) {
        foundDuplicate = key
      }
    }
  }
  return foundDuplicate
}

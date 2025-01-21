import { FieldType, Table } from "@budibase/types"
import { PROTECTED_INTERNAL_COLUMNS } from "./constants"

const allowDisplayColumnByType: Record<FieldType, boolean> = {
  [FieldType.STRING]: true,
  [FieldType.LONGFORM]: true,
  [FieldType.OPTIONS]: true,
  [FieldType.NUMBER]: true,
  [FieldType.DATETIME]: true,
  [FieldType.FORMULA]: true,
  [FieldType.AI]: true,
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
  [FieldType.AI]: false,
  [FieldType.ATTACHMENTS]: false,
  [FieldType.ATTACHMENT_SINGLE]: false,
  [FieldType.SIGNATURE_SINGLE]: false,
  [FieldType.ARRAY]: false,
  [FieldType.LINK]: false,
  [FieldType.BB_REFERENCE]: false,
  [FieldType.BB_REFERENCE_SINGLE]: false,
}

const allowDefaultColumnByType: Record<FieldType, boolean> = {
  [FieldType.NUMBER]: true,
  [FieldType.JSON]: true,
  [FieldType.DATETIME]: true,
  [FieldType.LONGFORM]: true,
  [FieldType.STRING]: true,
  [FieldType.OPTIONS]: true,
  [FieldType.ARRAY]: true,
  [FieldType.BIGINT]: true,
  [FieldType.BOOLEAN]: true,

  [FieldType.AUTO]: false,
  [FieldType.INTERNAL]: false,
  [FieldType.BARCODEQR]: false,
  [FieldType.FORMULA]: false,
  [FieldType.AI]: false,
  [FieldType.ATTACHMENTS]: false,
  [FieldType.ATTACHMENT_SINGLE]: false,
  [FieldType.SIGNATURE_SINGLE]: false,
  [FieldType.LINK]: false,
  [FieldType.BB_REFERENCE]: true,
  [FieldType.BB_REFERENCE_SINGLE]: true,
}

export function canBeDisplayColumn(type: FieldType): boolean {
  return !!allowDisplayColumnByType[type]
}

export function canBeSortColumn(type: FieldType): boolean {
  return !!allowSortColumnByType[type]
}

export function canHaveDefaultColumn(type: FieldType): boolean {
  return !!allowDefaultColumnByType[type]
}

export function findDuplicateInternalColumns(table: Table): string[] {
  // maintains the case of keys
  const casedKeys = Object.keys(table.schema)
  // get the column names
  const uncasedKeys = casedKeys.map(colName => colName.toLowerCase())
  // there are duplicates
  const set = new Set(uncasedKeys)
  let duplicates: string[] = []
  if (set.size !== uncasedKeys.length) {
    for (let key of set.keys()) {
      const count = uncasedKeys.filter(name => name === key).length
      if (count > 1) {
        duplicates.push(key)
      }
    }
  }

  for (let internalColumn of PROTECTED_INTERNAL_COLUMNS) {
    if (casedKeys.find(key => key === internalColumn)) {
      duplicates.push(internalColumn)
    }
  }
  return duplicates
}

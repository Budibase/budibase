import { FieldType } from "@budibase/types"

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
  [FieldType.ATTACHMENT]: false,
  [FieldType.LINK]: false,
  [FieldType.JSON]: false,
  [FieldType.BB_REFERENCE]: false,
}

export function canBeDisplayColumn(type: FieldType): boolean {
  return !!allowDisplayColumnByType[type]
}

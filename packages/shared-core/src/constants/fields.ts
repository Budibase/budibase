import { FieldType } from "@budibase/types"

type SwitchableTypes = Partial<{
  [K in FieldType]: [K, ...FieldType[]]
}>

export const SWITCHABLE_TYPES: SwitchableTypes = {
  [FieldType.STRING]: [
    FieldType.STRING,
    FieldType.OPTIONS,
    FieldType.LONGFORM,
    FieldType.BARCODEQR,
  ],
  [FieldType.OPTIONS]: [
    FieldType.OPTIONS,
    FieldType.STRING,
    FieldType.LONGFORM,
    FieldType.BARCODEQR,
  ],
  [FieldType.LONGFORM]: [
    FieldType.LONGFORM,
    FieldType.STRING,
    FieldType.OPTIONS,
    FieldType.BARCODEQR,
  ],
  [FieldType.BARCODEQR]: [
    FieldType.BARCODEQR,
    FieldType.STRING,
    FieldType.OPTIONS,
    FieldType.LONGFORM,
  ],
  [FieldType.NUMBER]: [FieldType.NUMBER, FieldType.BOOLEAN],
}

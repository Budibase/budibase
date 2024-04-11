import { FieldType } from "@budibase/types"

import OptionsCell from "../cells/OptionsCell.svelte"
import DateCell from "../cells/DateCell.svelte"
import MultiSelectCell from "../cells/MultiSelectCell.svelte"
import NumberCell from "../cells/NumberCell.svelte"
import RelationshipCell from "../cells/RelationshipCell.svelte"
import TextCell from "../cells/TextCell.svelte"
import LongFormCell from "../cells/LongFormCell.svelte"
import BooleanCell from "../cells/BooleanCell.svelte"
import FormulaCell from "../cells/FormulaCell.svelte"
import JSONCell from "../cells/JSONCell.svelte"
import AttachmentCell from "../cells/AttachmentCell.svelte"
import AttachmentSingleCell from "../cells/AttachmentSingleCell.svelte"
import BBReferenceCell from "../cells/BBReferenceCell.svelte"
import SignatureCell from "../cells/SignatureCell.svelte"

const TypeComponentMap = {
  [FieldType.STRING]: TextCell,
  [FieldType.OPTIONS]: OptionsCell,
  [FieldType.DATETIME]: DateCell,
  [FieldType.BARCODEQR]: TextCell,
  [FieldType.SIGNATURE]: SignatureCell,
  [FieldType.LONGFORM]: LongFormCell,
  [FieldType.ARRAY]: MultiSelectCell,
  [FieldType.NUMBER]: NumberCell,
  [FieldType.BOOLEAN]: BooleanCell,
  [FieldType.ATTACHMENTS]: AttachmentCell,
  [FieldType.ATTACHMENT_SINGLE]: AttachmentSingleCell,
  [FieldType.LINK]: RelationshipCell,
  [FieldType.FORMULA]: FormulaCell,
  [FieldType.JSON]: JSONCell,
  [FieldType.BB_REFERENCE]: BBReferenceCell,
}
export const getCellRenderer = column => {
  return TypeComponentMap[column?.schema?.type] || TextCell
}

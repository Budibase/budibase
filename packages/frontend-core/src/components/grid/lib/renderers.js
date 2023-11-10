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
import BBReferenceCell from "../cells/BBReferenceCell.svelte"

const TypeComponentMap = {
  text: TextCell,
  options: OptionsCell,
  datetime: DateCell,
  barcodeqr: TextCell,
  longform: LongFormCell,
  array: MultiSelectCell,
  number: NumberCell,
  boolean: BooleanCell,
  attachment: AttachmentCell,
  link: RelationshipCell,
  formula: FormulaCell,
  json: JSONCell,
  bb_reference: BBReferenceCell,
}
export const getCellRenderer = column => {
  return TypeComponentMap[column?.schema?.type] || TextCell
}

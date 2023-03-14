import OptionsCell from "./cells/OptionsCell.svelte"
import DateCell from "./cells/DateCell.svelte"
import MultiSelectCell from "./cells/MultiSelectCell.svelte"
import NumberCell from "./cells/NumberCell.svelte"
import RelationshipCell from "./cells/RelationshipCell.svelte"
import TextCell from "./cells/TextCell.svelte"
import BlankCell from "./cells/BlankCell.svelte"
import LongFormCell from "./cells/LongFormCell.svelte"

const TypeComponentMap = {
  text: TextCell,
  options: OptionsCell,
  datetime: DateCell,
  barcodeqr: BlankCell,
  longform: LongFormCell,
  array: MultiSelectCell,
  number: NumberCell,
  boolean: BlankCell,
  attachment: BlankCell,
  link: RelationshipCell,
  formula: BlankCell,
  json: BlankCell,
}
export const getCellRenderer = column => {
  return TypeComponentMap[column?.schema?.type] || TextCell
}

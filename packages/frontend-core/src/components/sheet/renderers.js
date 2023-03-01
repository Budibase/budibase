import OptionsCell from "./cells/OptionsCell.svelte"
import DateCell from "./cells/DateCell.svelte"
import MultiSelectCell from "./cells/MultiSelectCell.svelte"
import NumberCell from "./cells/NumberCell.svelte"
import RelationshipCell from "./cells/RelationshipCell.svelte"
import TextCell from "./cells/TextCell.svelte"

const TypeComponentMap = {
  options: OptionsCell,
  datetime: DateCell,
  array: MultiSelectCell,
  number: NumberCell,
  link: RelationshipCell,
}
export const getCellRenderer = column => {
  return TypeComponentMap[column?.schema?.type] || TextCell
}

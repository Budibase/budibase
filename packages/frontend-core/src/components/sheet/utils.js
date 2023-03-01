import OptionsCell from "./cells/OptionsCell.svelte"
import DateCell from "./cells/DateCell.svelte"
import MultiSelectCell from "./cells/MultiSelectCell.svelte"
import NumberCell from "./cells/NumberCell.svelte"
import RelationshipCell from "./cells/RelationshipCell.svelte"
import TextCell from "./cells/TextCell.svelte"

export const getColor = idx => {
  if (idx == null || idx === -1) {
    return null
  }
  return `hsla(${((idx + 1) * 222) % 360}, 90%, 75%, 0.3)`
}

export const getIconForField = field => {
  const type = field.schema.type
  if (type === "options") {
    return "ChevronDown"
  } else if (type === "datetime") {
    return "Date"
  }
  return "Text"
}

const TypeComponentMap = {
  options: OptionsCell,
  datetime: DateCell,
  array: MultiSelectCell,
  number: NumberCell,
  link: RelationshipCell,
}
export const getCellComponent = column => {
  return TypeComponentMap[column?.schema?.type] || TextCell
}

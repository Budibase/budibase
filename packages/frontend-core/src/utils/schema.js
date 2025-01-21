import { helpers } from "@budibase/shared-core"
import { TypeIconMap } from "../constants"

export const getColumnIcon = column => {
  if (column.schema.icon) {
    return column.schema.icon
  }
  if (column.calculationType) {
    return "Calculator"
  }
  if (column.schema.autocolumn) {
    return "MagicWand"
  }
  if (helpers.schema.isDeprecatedSingleUserColumn(column.schema)) {
    return "User"
  }
  const { type, subtype } = column.schema
  const result =
    typeof TypeIconMap[type] === "object" && subtype
      ? TypeIconMap[type][subtype]
      : TypeIconMap[type]

  return result || "Text"
}

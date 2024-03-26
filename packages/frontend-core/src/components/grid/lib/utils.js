import { FieldType, FieldTypeSubtypes } from "@budibase/types"

export const getColor = (idx, opacity = 0.3) => {
  if (idx == null || idx === -1) {
    idx = 0
  }
  return `hsla(${((idx + 1) * 222) % 360}, 90%, 75%, ${opacity})`
}

const TypeIconMap = {
  [FieldType.STRING]: "Text",
  [FieldType.OPTIONS]: "Dropdown",
  [FieldType.DATETIME]: "Date",
  [FieldType.BARCODEQR]: "Camera",
  [FieldType.LONGFORM]: "TextAlignLeft",
  [FieldType.ARRAY]: "Dropdown",
  [FieldType.NUMBER]: "123",
  [FieldType.BOOLEAN]: "Boolean",
  [FieldType.ATTACHMENT]: "AppleFiles",
  [FieldType.ATTACHMENTS]: "AppleFiles",
  [FieldType.LINK]: "DataCorrelated",
  [FieldType.FORMULA]: "Calculator",
  [FieldType.JSON]: "Brackets",
  [FieldType.BIGINT]: "TagBold",
  [FieldType.BB_REFERENCE]: {
    [FieldTypeSubtypes.BB_REFERENCE.USER]: "User",
    [FieldTypeSubtypes.BB_REFERENCE.USERS]: "UserGroup",
  },
}

export const getColumnIcon = column => {
  if (column.schema.autocolumn) {
    return "MagicWand"
  }
  const { type, subtype } = column.schema

  const result =
    typeof TypeIconMap[type] === "object" && subtype
      ? TypeIconMap[type][subtype]
      : TypeIconMap[type]

  return result || "Text"
}

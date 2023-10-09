export const getColor = (idx, opacity = 0.3) => {
  if (idx == null || idx === -1) {
    return null
  }
  return `hsla(${((idx + 1) * 222) % 360}, 90%, 75%, ${opacity})`
}

const TypeIconMap = {
  text: "Text",
  options: "Dropdown",
  datetime: "Date",
  barcodeqr: "Camera",
  longform: "TextAlignLeft",
  array: "Dropdown",
  number: "123",
  boolean: "Boolean",
  attachment: "AppleFiles",
  link: "DataCorrelated",
  formula: "Calculator",
  json: "Brackets",
  bigint: "TagBold",
  bb_reference: {
    user: "User",
    users: "UserGroup",
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

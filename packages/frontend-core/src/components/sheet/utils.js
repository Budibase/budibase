export const getColor = (idx, opacity = 0.3) => {
  if (idx == null || idx === -1) {
    return null
  }
  return `hsla(${((idx + 1) * 222) % 360}, 90%, 75%, ${opacity})`
}

const DataTypeIconMap = {
  options: "Dropdown",
  datetime: "Date",
  text: "Text",
  barcodeqr: "Camera",
  longform: "TextAlignLeft",
  array: "Dropdown",
  number: "Text",
  boolean: "Boolean",
  attachment: "AppleFiles",
  link: "Link",
  formula: "Calculator",
  json: "Brackets",
}

export const getIconForField = field => {
  const type = field.schema.type
  return DataTypeIconMap[type] || "Text"
}

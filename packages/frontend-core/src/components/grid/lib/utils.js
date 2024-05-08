import { TypeIconMap } from "../../../constants"

export const getColor = (idx, opacity = 0.3) => {
  if (idx == null || idx === -1) {
    idx = 0
  }
  return `hsla(${((idx + 1) * 222) % 360}, 90%, 75%, ${opacity})`
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

export const parseEventLocation = e => {
  return {
    x: e.clientX ?? e.touches?.[0]?.clientX,
    y: e.clientY ?? e.touches?.[0]?.clientY,
  }
}

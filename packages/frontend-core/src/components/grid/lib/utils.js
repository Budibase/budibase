import { TypeIconMap } from "../../../constants"

// we can't use "-" for joining the ID/field, as this can be present in the ID or column name
// using something very unusual to avoid this problem
const JOINING_CHARACTER = "‽‽"

export const parseCellID = rowId => {
  if (!rowId) {
    return undefined
  }
  const parts = rowId.split(JOINING_CHARACTER)
  const field = parts.pop()
  return { id: parts.join(JOINING_CHARACTER), field }
}

export const getCellID = (rowId, fieldName) => {
  return `${rowId}${JOINING_CHARACTER}${fieldName}`
}

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

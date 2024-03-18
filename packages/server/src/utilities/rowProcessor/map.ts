import { FieldType } from "@budibase/types"

const parseArrayString = (value: any) => {
  if (typeof value === "string") {
    if (value === "") {
      return []
    }
    let result
    try {
      result = JSON.parse(value.replace(/'/g, '"'))
      return result
    } catch (e) {
      return value
    }
  }
  return value
}

/**
 * A map of how we convert various properties in rows to each other based on the row type.
 */
export const TYPE_TRANSFORM_MAP: Record<string, (val: any) => any> = {
  [FieldType.LINK]: (link: any) => {
    if (link === "" || link === null || link === undefined) {
      return []
    }
    if (Array.isArray(link) && typeof link[0] === "object") {
      return link.map(el => (el && el._id ? el._id : el))
    }
    if (typeof link === "string") {
      return [link]
    }
    return link
  },
  [FieldType.OPTIONS]: (val: any) => {
    if (val === "" || val === null) {
      return null
    }
    return val
  },
  [FieldType.ARRAY]: (val: any) => {
    if (val === null) {
      return []
    }
    if (val === undefined) {
      return undefined
    }
    return parseArrayString(val)
  },
  [FieldType.STRING]: (val: any) => {
    if (val === "" || val === null) {
      return null
    }
    return val
  },
  [FieldType.BARCODEQR]: (val: any) => {
    if (val === "" || val === null) {
      return null
    }
    return val
  },
  [FieldType.FORMULA]: (val: any) => {
    if (val === "" || val === null) {
      return null
    }
    return val
  },
  [FieldType.LONGFORM]: (val: any) => {
    if (val === "" || val === null) {
      return null
    }
    return val
  },
  [FieldType.NUMBER]: (val: any) => {
    if (val === "" || val === null) {
      return null
    }
    if (val === undefined) {
      return undefined
    }
    return parseFloat(val)
  },
  [FieldType.BIGINT]: (val: any) => {
    if (val === "" || val === null) {
      return null
    }
    return val
  },
  [FieldType.DATETIME]: (val: any) => {
    if (val === "" || val === null) {
      return null
    }
    if (val === undefined) {
      return undefined
    }
    if (val instanceof Date) {
      return val.toISOString()
    }
    return val
  },
  [FieldType.ATTACHMENT]: (val: any) => {
    if (val === null) {
      return []
    }
    if (val === undefined) {
      return undefined
    }
    return parseArrayString(val)
  },
  [FieldType.BOOLEAN]: (val: any) => {
    if (val === "" || val === null) {
      return null
    }
    if (val === undefined) {
      return undefined
    }
    return val
  },
  [FieldType.AUTO]: () => {
    return undefined
  },
  [FieldType.JSON]: (val: any) => {
    try {
      if (val === "") {
        return undefined
      }
      return JSON.parse(val)
    } catch (err) {
      return val
    }
  },
}

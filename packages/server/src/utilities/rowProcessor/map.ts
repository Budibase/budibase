import { sql } from "@budibase/backend-core"
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
export const TYPE_TRANSFORM_MAP: any = {
  [FieldType.LINK]: {
    "": [],
    //@ts-ignore
    [null]: [],
    //@ts-ignore
    [undefined]: undefined,
    parse: (link: any) => {
      if (Array.isArray(link) && typeof link[0] === "object") {
        return link.map(el => (el && el._id ? el._id : el))
      }
      if (typeof link === "string") {
        return [link]
      }
      return link
    },
  },
  [FieldType.OPTIONS]: {
    "": null,
    //@ts-ignore
    [null]: null,
    //@ts-ignore
    [undefined]: undefined,
  },
  [FieldType.ARRAY]: {
    //@ts-ignore
    [null]: [],
    //@ts-ignore
    [undefined]: undefined,
    parse: parseArrayString,
  },
  [FieldType.BB_REFERENCE]: {
    //@ts-ignore
    [null]: [],
    //@ts-ignore
    [undefined]: undefined,
    parse: parseArrayString,
  },
  [FieldType.STRING]: {
    "": null,
    //@ts-ignore
    [null]: null,
    //@ts-ignore
    [undefined]: undefined,
  },
  [FieldType.BARCODEQR]: {
    "": null,
    //@ts-ignore
    [null]: null,
    //@ts-ignore
    [undefined]: undefined,
  },
  [FieldType.FORMULA]: {
    "": null,
    //@ts-ignore
    [null]: null,
    //@ts-ignore
    [undefined]: undefined,
  },
  [FieldType.LONGFORM]: {
    "": null,
    //@ts-ignore
    [null]: null,
    //@ts-ignore
    [undefined]: undefined,
  },
  [FieldType.NUMBER]: {
    "": null,
    //@ts-ignore
    [null]: null,
    //@ts-ignore
    [undefined]: undefined,
    parse: (n: any) => {
      const parsed = parseFloat(n)
      if (isNaN(parsed)) {
        throw new Error(`Invalid number value "${n}"`)
      }
      return parsed
    },
  },
  [FieldType.BIGINT]: {
    "": null,
    //@ts-ignore
    [null]: null,
    //@ts-ignore
    [undefined]: undefined,
  },
  [FieldType.DATETIME]: {
    "": null,
    //@ts-ignore
    [null]: null,
    //@ts-ignore
    [undefined]: undefined,
    parse: (date: any) => {
      if (date instanceof Date) {
        return date.toISOString()
      } else if (typeof date === "string" && sql.utils.isValidTime(date)) {
        return date
      } else {
        const parsed = new Date(date)
        if (isNaN(parsed.getTime())) {
          throw new Error(`Invalid date value: "${date}"`)
        }
        return date
      }
    },
  },
  [FieldType.ATTACHMENTS]: {
    //@ts-ignore
    [null]: [],
    //@ts-ignore
    [undefined]: undefined,
    parse: parseArrayString,
  },
  [FieldType.ATTACHMENT_SINGLE]: {
    "": null,
  },
  [FieldType.BOOLEAN]: {
    "": null,
    //@ts-ignore
    [null]: null,
    //@ts-ignore
    [undefined]: undefined,
    true: true,
    false: false,
  },
  [FieldType.AUTO]: {
    parse: () => undefined,
  },
  [FieldType.JSON]: {
    parse: (input: any) => {
      try {
        if (input === "") {
          return undefined
        }
        return JSON.parse(input)
      } catch (err) {
        return input
      }
    },
  },
}

import { sql } from "@budibase/backend-core"
import { FieldType } from "@budibase/types"

const parseArrayString = (value: string | unknown) => {
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
export const TYPE_TRANSFORM_MAP: Record<
  FieldType,
  {
    ""?: null | []
    true?: true
    false?: false
    parse?: (
      input: string | string[] | { _id: unknown }[] | Date
    ) => string | undefined | {}
  }
> = {
  [FieldType.LINK]: {
    "": [],
    //@ts-ignore
    [null]: [],
    //@ts-ignore
    [undefined]: undefined,
    parse: link => {
      if (Array.isArray(link) && typeof link[0] === "object") {
        return link.map(el => {
          const objEl = el as { _id: unknown }
          return objEl && objEl._id ? objEl._id : el
        })
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
    //@ts-expect-error
    [undefined]: undefined,
    parse: (n: unknown) => {
      const parsed = parseFloat(n as string)
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
    parse: input => {
      if (input instanceof Date) {
        return input.toISOString()
      } else if (typeof input === "string" && sql.utils.isValidTime(input)) {
        return input
      } else {
        // Date strings can come in without timezone info. In this case we want
        // to make sure we're parsing them in as UTC because the rest of the
        // system expects UTC dates.
        let parsed = new Date(`${input}Z`)
        if (isNaN(parsed.getTime())) {
          parsed = new Date(input as string)
          if (isNaN(parsed.getTime())) {
            throw new Error(`Invalid date value: "${input}"`)
          }
        }
        return parsed.toISOString()
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
    parse: input => {
      try {
        if (typeof input !== "string") {
          throw new Error("input was not a string")
        }
        if (input === "") {
          return undefined
        }
        return JSON.parse(input)
      } catch (err) {
        return input
      }
    },
  },
  [FieldType.AI]: {},
  [FieldType.BB_REFERENCE_SINGLE]: {},
  [FieldType.SIGNATURE_SINGLE]: {},
  [FieldType.INTERNAL]: {},
}

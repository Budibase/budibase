import {
  BBReferenceFieldSubType,
  FieldSchema,
  FieldType,
  Row,
  TableSchema,
} from "@budibase/types"
import { Helpers } from "@budibase/bbui"

// Singleton formatter to save us creating one every time
const NumberFormatter = Intl.NumberFormat()

export type StringifiedRow = { [key: string]: string }

// Formats a number according to the locale
export const formatNumber = (value: any): string => {
  const type = typeof value
  if (type !== "string" && type !== "number") {
    return ""
  }
  if (type === "string" && !value.trim().length) {
    return ""
  }
  const res = NumberFormatter.format(value)
  return res === "NaN" ? stringifyValue(value) : res
}

// Attempts to stringify any type of value
const stringifyValue = (value: any): string => {
  if (value == null) {
    return ""
  }
  if (typeof value === "string") {
    return value
  }
  if (typeof value.toString === "function") {
    return stringifyValue(value.toString())
  }
  try {
    return JSON.stringify(value)
  } catch (e) {
    return ""
  }
}

const stringifyField = (value: any, schema: FieldSchema): string => {
  switch (schema.type) {
    // Auto should not exist as it should always be typed by its underlying
    // real type, like date or user
    case FieldType.AUTO:
      return ""

    // Just state whether signatures exist or not
    case FieldType.SIGNATURE_SINGLE:
      return value ? "Yes" : "No"

    // Extract attachment names
    case FieldType.ATTACHMENT_SINGLE:
    case FieldType.ATTACHMENTS: {
      if (!value) {
        return ""
      }
      const arrayValue = Array.isArray(value) ? value : [value]
      return arrayValue
        .map(x => x.name)
        .filter(x => !!x)
        .join(", ")
    }

    // Extract primary displays from relationships
    case FieldType.LINK: {
      if (!value) {
        return ""
      }
      const arrayValue = Array.isArray(value) ? value : [value]
      return arrayValue
        .map(x => x.primaryDisplay)
        .filter(x => !!x)
        .join(", ")
    }

    // Stringify JSON blobs
    case FieldType.JSON:
      return value ? JSON.stringify(value) : ""

    // User is the only BB reference subtype right now
    case FieldType.BB_REFERENCE:
    case FieldType.BB_REFERENCE_SINGLE: {
      if (
        schema.subtype !== BBReferenceFieldSubType.USERS &&
        schema.subtype !== BBReferenceFieldSubType.USER
      ) {
        return ""
      }
      if (!value) {
        return ""
      }
      const arrayVal = Array.isArray(value) ? value : [value]
      return arrayVal?.map((user: any) => user.primaryDisplay).join(", ") || ""
    }

    // Join arrays with commas
    case FieldType.ARRAY:
      return value?.join(", ") || ""

    // Just capitalise booleans
    case FieldType.BOOLEAN:
      return Helpers.capitalise(value?.toString() || "false")

    // Format dates into something readable
    case FieldType.DATETIME: {
      return Helpers.getDateDisplayValue(value, {
        enableTime: !schema.dateOnly,
        timeOnly: schema.timeOnly,
      })
    }

    // Format numbers using a locale string
    case FieldType.NUMBER:
      return formatNumber(value)

    // Simple string types
    case FieldType.STRING:
    case FieldType.LONGFORM:
    case FieldType.BIGINT:
    case FieldType.OPTIONS:
    case FieldType.AI:
    case FieldType.BARCODEQR:
      return value || ""

    // Fallback for unknown types or future column types that we forget to add
    case FieldType.FORMULA:
    default:
      return stringifyValue(value)
  }
}

// Stringifies every property of a row, ensuring they are all human-readable
// strings for display
export const stringifyRow = (row: Row, schema: TableSchema): StringifiedRow => {
  let stringified: StringifiedRow = {}
  Object.entries(schema).forEach(([field, fieldSchema]) => {
    stringified[field] = stringifyField(
      Helpers.deepGet(row, field),
      fieldSchema
    )
  })
  return stringified
}

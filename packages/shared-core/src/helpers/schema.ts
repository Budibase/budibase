import {
  BBReferenceFieldSubType,
  FieldConstraints,
  FieldSchema,
  FieldType,
} from "@budibase/types"

export function isDeprecatedSingleUserColumn(
  schema: Pick<FieldSchema, "type" | "subtype" | "constraints">
): schema is {
  type: FieldType.BB_REFERENCE
  subtype: BBReferenceFieldSubType.USER
} {
  const result =
    schema.type === FieldType.BB_REFERENCE &&
    schema.subtype === BBReferenceFieldSubType.USER &&
    schema.constraints?.type !== "array"
  return result
}

export function isRequired(constraints: FieldConstraints | undefined) {
  const isRequired =
    !!constraints &&
    ((typeof constraints.presence !== "boolean" &&
      constraints.presence?.allowEmpty === false) ||
      constraints.presence === true)
  return isRequired
}

// SQS does not support non-ASCII characters in column names, so we need to
// replace them with unicode escape sequences.
export function encodeNonAscii(str: string): string {
  return str
    .split("")
    .map(char => {
      return char.charCodeAt(0) > 127
        ? "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0")
        : char
    })
    .join("")
}

export function decodeNonAscii(str: string): string {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  )
}

export function isNumeric(field: FieldSchema) {
  return field.type === FieldType.NUMBER || field.type === FieldType.BIGINT
}

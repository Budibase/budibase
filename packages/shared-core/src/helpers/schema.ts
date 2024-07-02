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

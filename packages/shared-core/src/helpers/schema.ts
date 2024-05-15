import {
  BBReferenceFieldSubType,
  FieldSchema,
  FieldType,
} from "@budibase/types"

export function isDeprecatedSingleUserColumn(
  schema: Pick<FieldSchema, "type" | "subtype" | "constraints">
) {
  const result =
    schema.type === FieldType.BB_REFERENCE &&
    schema.subtype === BBReferenceFieldSubType.USER &&
    schema.constraints?.type !== "array"
  return result
}

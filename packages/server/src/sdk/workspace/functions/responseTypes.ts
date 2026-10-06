import {
  FieldType,
  JsonFieldSubType,
  type FunctionQueryResponseField,
  type FunctionQueryResponseFieldType,
  type FunctionQueryResponseSchema,
  type Query,
} from "@budibase/types"
import {
  FUNCTION_QUERY_RESPONSE_LIMITS,
  renderQueryResponseType,
} from "@budibase/shared-core"

export {
  FUNCTION_QUERY_RESPONSE_LIMITS,
  renderQueryResponseType,
} from "@budibase/shared-core"

const fieldTypes: Record<string, FunctionQueryResponseFieldType> = {
  [FieldType.STRING]: "string",
  [FieldType.NUMBER]: "number",
  [FieldType.BOOLEAN]: "boolean",
  [FieldType.DATETIME]: "string",
  [FieldType.ARRAY]: "array",
  [FieldType.JSON]: "json",
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export const inferQueryResponseSchema = ({
  query,
}: {
  query: Query
}): FunctionQueryResponseSchema | undefined => {
  if (!isRecord(query.schema)) {
    return undefined
  }
  const fields: FunctionQueryResponseField[] = []
  for (const name in query.schema) {
    if (!Object.hasOwn(query.schema, name)) {
      continue
    }
    if (
      fields.length >= FUNCTION_QUERY_RESPONSE_LIMITS.maxFields ||
      name.length > FUNCTION_QUERY_RESPONSE_LIMITS.maxFieldNameLength
    ) {
      return undefined
    }
    const entry: unknown = query.schema[name]
    const metadata = isRecord(entry) ? entry : undefined
    const type = typeof entry === "string" ? entry : metadata?.type
    if (typeof type !== "string" || !Object.hasOwn(fieldTypes, type)) {
      return undefined
    }
    // Query previews sample rows and do not establish requiredness,
    // nullability, or homogeneous array element types.
    let fieldType = fieldTypes[type]
    if (metadata?.subtype !== undefined) {
      if (
        type !== FieldType.JSON ||
        metadata.subtype !== JsonFieldSubType.ARRAY
      ) {
        return undefined
      }
      fieldType = "array"
    }
    fields.push({ name, type: fieldType })
  }
  if (!fields.length) {
    return undefined
  }
  const schema = { fields: fields.sort((a, b) => a.name.localeCompare(b.name)) }
  return renderQueryResponseType({ schema }) === "JsonValue"
    ? undefined
    : schema
}

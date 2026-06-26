import type { FieldType, QuerySchema } from "@budibase/types"
import { coerce } from "../../../utilities/rowProcessor"

const getType = (schema: string | QuerySchema | undefined): FieldType | undefined =>
  (typeof schema === "string" ? schema : schema?.type) as FieldType | undefined

// The set type is still valid if the sampled value would successfully coerce to
// it - the same coercion the query runner applies at execution time. coerce()
// throws when a value can't become the type (e.g. "abc" -> NUMBER/DATETIME) and
// never throws for STRING (any value can be a string), which is exactly the
// asymmetry we want: a deliberate downgrade to text always sticks, while richer
// types are only kept when the data genuinely fits them.
const valueFitsType = (value: unknown, type: FieldType): boolean => {
  if (value == null || value === "") {
    return true
  }
  try {
    coerce(value as string | Date | string[], type)
    return true
  } catch {
    return false
  }
}

// Merge a freshly detected preview schema with the previously set one, keeping
// the user's/previous type whenever the (first-row) data still fits it. Columns
// that disappeared from the results keep their previous schema; brand-new
// columns use the detected type.
export function mergePreviewSchema(
  previewSchema: Record<string, string | QuerySchema>,
  existingSchema: Record<string, string | QuerySchema> | undefined,
  firstRow: Record<string, any> | undefined
): Record<string, string | QuerySchema> {
  if (!existingSchema) {
    return previewSchema
  }
  const merged = { ...previewSchema }
  for (const key of Object.keys(existingSchema)) {
    const existing = existingSchema[key]
    if (!merged[key]) {
      merged[key] = existing
      continue
    }
    const existingType = getType(existing)
    if (existingType && valueFitsType(firstRow?.[key], existingType)) {
      merged[key] = existing
    }
  }
  return merged
}

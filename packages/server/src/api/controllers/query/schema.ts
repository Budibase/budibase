import { FieldType, QuerySchema } from "@budibase/types"
import { coerce } from "../../../utilities/rowProcessor"

type SchemaEntry = string | QuerySchema

const getType = (entry: SchemaEntry | undefined): FieldType | undefined =>
  (typeof entry === "string" ? entry : entry?.type) as FieldType | undefined

// A previously set type only wins over detection when detection fell back to
// STRING (its "can't tell" result - SQL drivers return dates and numbers as
// strings) and the value still coerces to that type, using the same coerce()
// the query runner applies at execution time. Concrete detections (number,
// boolean, json, array, datetime) always win, so a genuine data change still
// updates the schema. One deliberate asymmetry: an explicit Text override
// sticks for any scalar value.
const keepExisting = (
  existing: SchemaEntry,
  detected: SchemaEntry,
  value: unknown
): boolean => {
  const existingType = getType(existing)
  if (!existingType) {
    return false
  }
  if (value == null || value === "") {
    return true
  }
  if (typeof value === "object" && !(value instanceof Date)) {
    return false
  }
  if (existingType === FieldType.STRING) {
    return true
  }
  if (getType(detected) !== FieldType.STRING) {
    return false
  }
  try {
    coerce(value as string | Date | string[], existingType)
    return true
  } catch {
    return false
  }
}

// Merge the freshly detected preview schema with the previously set one, so a
// re-run doesn't overwrite the user's type choice (e.g. a date kept as
// DATETIME) while genuine data changes still re-detect. Columns that
// disappeared from the results keep their previous schema; brand-new columns
// use the detected type.
export function mergePreviewSchema(
  previewSchema: Record<string, SchemaEntry>,
  existingSchema: Record<string, SchemaEntry> | undefined,
  firstRow: Record<string, any> | undefined
): Record<string, SchemaEntry> {
  if (!existingSchema) {
    return previewSchema
  }
  const merged = { ...previewSchema }
  for (const key of Object.keys(existingSchema)) {
    const existing = existingSchema[key]
    if (!merged[key] || keepExisting(existing, merged[key], firstRow?.[key])) {
      merged[key] = existing
    }
  }
  return merged
}

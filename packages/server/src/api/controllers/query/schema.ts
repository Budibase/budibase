import { FieldType, QuerySchema } from "@budibase/types"
import { coerce } from "../../../utilities/rowProcessor"

type SchemaEntry = string | QuerySchema

const getType = (entry: SchemaEntry | undefined): FieldType | undefined =>
  (typeof entry === "string" ? entry : entry?.type) as FieldType | undefined

// Whether a string value genuinely fits the given type. Only NUMBER and
// DATETIME can lean on coerce() (the same casting Budibase uses when converting
// values to these types) - it throws for those on bad input but silently
// returns the input for every other type, so BOOLEAN and JSON are validated
// explicitly and anything else re-detects.
const stringFitsType = (value: string, type: FieldType): boolean => {
  switch (type) {
    case FieldType.NUMBER:
    case FieldType.DATETIME:
      try {
        coerce(value, type)
        return true
      } catch {
        return false
      }
    case FieldType.BOOLEAN:
      return value === "true" || value === "false"
    case FieldType.JSON:
      try {
        return typeof JSON.parse(value) === "object"
      } catch {
        return false
      }
    default:
      return false
  }
}

// A previously set type only wins over detection when detection fell back to
// STRING (its "can't tell" result - SQL drivers return dates and numbers as
// strings) and the value still fits that type. Concrete detections (number,
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
  const valueIsObject = typeof value === "object" && !(value instanceof Date)
  if (existingType === FieldType.STRING && !valueIsObject) {
    return true
  }
  if (getType(detected) !== FieldType.STRING || typeof value !== "string") {
    return false
  }
  return stringFitsType(value, existingType)
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

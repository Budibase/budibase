import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { FieldType, Row, TableSchema } from "@budibase/types"

dayjs.extend(utc)
dayjs.extend(timezone)

// ISO-8601 with an explicit UTC offset, e.g. "2025-05-01T10:00:00+01:00", so
// the wall-clock time matches the grid while the instant stays unambiguous.
const OFFSET_ISO_FORMAT = "YYYY-MM-DDTHH:mm:ssZ"

const isTimezoneAwareDate = (schema: TableSchema[string]): boolean =>
  schema.type === FieldType.DATETIME &&
  !schema.dateOnly &&
  !schema.timeOnly &&
  !schema.ignoreTimezones

const isValidTimezone = (tz: string): boolean => {
  try {
    return dayjs().tz(tz) != null
  } catch {
    return false
  }
}

export const convertDateValueToTimezone = (
  value: unknown,
  tz: string
): unknown => {
  if (typeof value !== "string" || value.length === 0) {
    return value
  }
  const parsed = dayjs.utc(value)
  if (!parsed.isValid()) {
    return value
  }
  return parsed.tz(tz).format(OFFSET_ISO_FORMAT)
}

// Date-only, time-only and timezone-ignoring fields are left untouched, as the
// grid renders those verbatim. Without a valid timezone the row is returned
// unchanged, preserving the existing UTC behaviour.
export const applyTimezoneToRow = (
  row: Row,
  schema: TableSchema,
  tz?: string
): Row => {
  if (!tz || !isValidTimezone(tz) || !row) {
    return row
  }

  let result: Row | undefined
  for (const [field, fieldSchema] of Object.entries(schema)) {
    if (!isTimezoneAwareDate(fieldSchema) || row[field] == null) {
      continue
    }
    const converted = convertDateValueToTimezone(row[field], tz)
    if (converted !== row[field]) {
      result = result ?? { ...row }
      result[field] = converted
    }
  }

  return result ?? row
}

export const applyTimezoneToRows = (
  rows: Row[],
  schema: TableSchema,
  tz?: string
): Row[] => {
  if (!tz || !Array.isArray(rows)) {
    return rows
  }
  return rows.map(row => applyTimezoneToRow(row, schema, tz))
}

// Handles both single-row ({ row }) and multi-row ({ rows }) tool results.
export const applyTimezoneToToolResult = <T extends Record<string, any>>(
  result: T,
  schema: TableSchema,
  tz?: string
): T => {
  if (!tz || !result || typeof result !== "object") {
    return result
  }
  let output = result
  if (output.row && typeof output.row === "object") {
    output = { ...output, row: applyTimezoneToRow(output.row, schema, tz) }
  }
  if (Array.isArray(output.rows)) {
    output = { ...output, rows: applyTimezoneToRows(output.rows, schema, tz) }
  }
  return output
}

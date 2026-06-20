import dayjs from "dayjs"
import { FieldType, Row, TableSchema } from "@budibase/types"
import {
  applyTimezoneToRow,
  applyTimezoneToRows,
  applyTimezoneToToolResult,
  convertDateValueToTimezone,
} from "../dateFormatting"

const schema: TableSchema = {
  name: {
    type: FieldType.STRING,
    name: "name",
  },
  eventTime: {
    type: FieldType.DATETIME,
    name: "eventTime",
  },
  birthday: {
    type: FieldType.DATETIME,
    name: "birthday",
    dateOnly: true,
  },
  startTime: {
    type: FieldType.DATETIME,
    name: "startTime",
    timeOnly: true,
  },
  localStamp: {
    type: FieldType.DATETIME,
    name: "localStamp",
    ignoreTimezones: true,
  },
}

// A timezone-aware DATETIME field is stored as a UTC ISO string ending in "Z".
const UTC_VALUE = "2025-05-01T09:00:00.000Z"

describe("AI Tools - date formatting", () => {
  describe("convertDateValueToTimezone", () => {
    it("expresses a UTC datetime in a non-UTC timezone (BST / UTC+1)", () => {
      const result = convertDateValueToTimezone(UTC_VALUE, "Europe/London")
      expect(result).toBe("2025-05-01T10:00:00+01:00")
    })

    it("keeps the same wall-clock for a UTC user with a +00:00 offset", () => {
      const result = convertDateValueToTimezone(UTC_VALUE, "UTC")
      expect(result).toBe("2025-05-01T09:00:00+00:00")
    })

    it("handles negative offsets (America/New_York, EDT / UTC-4)", () => {
      const result = convertDateValueToTimezone(UTC_VALUE, "America/New_York")
      expect(result).toBe("2025-05-01T05:00:00-04:00")
    })

    it("respects daylight savings (Europe/London in winter is +00:00)", () => {
      const result = convertDateValueToTimezone(
        "2025-01-01T09:00:00.000Z",
        "Europe/London"
      )
      expect(result).toBe("2025-01-01T09:00:00+00:00")
    })

    it("preserves the exact instant after conversion", () => {
      const result = convertDateValueToTimezone(UTC_VALUE, "Europe/London")
      expect(dayjs(result as string).toISOString()).toBe(
        "2025-05-01T09:00:00.000Z"
      )
    })

    it("leaves non-string and empty values untouched", () => {
      expect(convertDateValueToTimezone(null, "Europe/London")).toBeNull()
      expect(convertDateValueToTimezone("", "Europe/London")).toBe("")
    })
  })

  describe("applyTimezoneToRow", () => {
    it("converts only timezone-aware datetime fields", () => {
      const row: Row = {
        name: "Meeting",
        eventTime: UTC_VALUE,
        birthday: "1990-05-01",
        startTime: "09:00:00",
        localStamp: "2025-05-01T09:00:00",
      }

      const result = applyTimezoneToRow(row, schema, "Europe/London")

      expect(result.eventTime).toBe("2025-05-01T10:00:00+01:00")
      expect(result.birthday).toBe("1990-05-01")
      expect(result.startTime).toBe("09:00:00")
      expect(result.localStamp).toBe("2025-05-01T09:00:00")
      expect(result.name).toBe("Meeting")
    })

    it("returns the row unchanged when no timezone is provided", () => {
      const row: Row = { name: "Meeting", eventTime: UTC_VALUE }
      const result = applyTimezoneToRow(row, schema, undefined)
      expect(result).toBe(row)
      expect(result.eventTime).toBe(UTC_VALUE)
    })

    it("returns the row unchanged for an invalid timezone", () => {
      const row: Row = { name: "Meeting", eventTime: UTC_VALUE }
      const result = applyTimezoneToRow(row, schema, "Not/AZone")
      expect(result.eventTime).toBe(UTC_VALUE)
    })

    it("does not mutate the original row", () => {
      const row: Row = { name: "Meeting", eventTime: UTC_VALUE }
      applyTimezoneToRow(row, schema, "Europe/London")
      expect(row.eventTime).toBe(UTC_VALUE)
    })

    it("ignores null datetime values", () => {
      const row: Row = { name: "Meeting", eventTime: null }
      const result = applyTimezoneToRow(row, schema, "Europe/London")
      expect(result.eventTime).toBeNull()
    })
  })

  describe("applyTimezoneToRows / applyTimezoneToToolResult", () => {
    it("converts datetime fields across multiple rows", () => {
      const rows: Row[] = [
        { name: "A", eventTime: UTC_VALUE },
        { name: "B", eventTime: "2025-01-01T09:00:00.000Z" },
      ]
      const result = applyTimezoneToRows(rows, schema, "Europe/London")
      expect(result[0].eventTime).toBe("2025-05-01T10:00:00+01:00")
      expect(result[1].eventTime).toBe("2025-01-01T09:00:00+00:00")
    })

    it("handles single-row tool results ({ row })", () => {
      const result = applyTimezoneToToolResult(
        { row: { name: "A", eventTime: UTC_VALUE } },
        schema,
        "Europe/London"
      )
      expect(result.row.eventTime).toBe("2025-05-01T10:00:00+01:00")
    })

    it("handles multi-row tool results ({ rows })", () => {
      const result = applyTimezoneToToolResult(
        { rows: [{ name: "A", eventTime: UTC_VALUE }], hasNextPage: false },
        schema,
        "Europe/London"
      )
      expect(result.rows[0].eventTime).toBe("2025-05-01T10:00:00+01:00")
      expect(result.hasNextPage).toBe(false)
    })

    it("returns the result untouched without a timezone", () => {
      const original = { row: { name: "A", eventTime: UTC_VALUE } }
      const result = applyTimezoneToToolResult(original, schema, undefined)
      expect(result).toBe(original)
    })
  })
})

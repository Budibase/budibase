import { describe, expect, it } from "vitest"
import { formatActivityDate } from "./activityDate"

describe("formatActivityDate", () => {
  it.each(["2026-10-05T11:00:00", new Date(2026, 9, 5, 11).getTime()])(
    "formats a date supplied as %s",
    value => {
      expect(formatActivityDate(value)).toBe("Oct 5, 2026 11:00 AM")
    }
  )

  it("shows Unknown time for invalid dates", () => {
    expect(formatActivityDate("invalid-date")).toBe("Unknown time")
  })
})

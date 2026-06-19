// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import dayjs from "dayjs"
import { Helpers } from "@budibase/bbui"

const { getDateDisplayValue } = Helpers

// A fixed local afternoon time so 12h/24h formatting differs visibly
const value = dayjs("2024-01-15T14:30:00")

describe("getDateDisplayValue time format", () => {
  it("defaults to 24 hour format to preserve existing behaviour", () => {
    expect(getDateDisplayValue(value, { timeOnly: true })).toBe("14:30")
  })

  it("renders time only in 24 hour format when time24hr is true", () => {
    expect(getDateDisplayValue(value, { timeOnly: true, time24hr: true })).toBe(
      "14:30"
    )
  })

  it("renders time only in 12 hour format when time24hr is false", () => {
    expect(
      getDateDisplayValue(value, { timeOnly: true, time24hr: false })
    ).toBe("02:30 PM")
  })

  it("uses 24 hour time for date and time values by default", () => {
    expect(getDateDisplayValue(value)).toMatch(/14:30$/)
  })

  it("uses 12 hour time for date and time values when time24hr is false", () => {
    expect(getDateDisplayValue(value, { time24hr: false })).toMatch(/02:30 PM$/)
  })

  it("ignores time format for date only values", () => {
    const result = getDateDisplayValue(value, {
      enableTime: false,
      time24hr: false,
    })
    expect(result).not.toContain("PM")
    expect(result).not.toContain("14:30")
  })

  it("returns an empty string for invalid values", () => {
    expect(getDateDisplayValue(null, { time24hr: false })).toBe("")
  })
})

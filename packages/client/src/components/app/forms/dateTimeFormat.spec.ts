// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import dayjs from "dayjs"
import { Helpers } from "@budibase/bbui"

const { getDateDisplayValue, parseTimeInput, isPartialTimeInput } = Helpers

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

describe("parseTimeInput", () => {
  it.each([
    ["8:00", "08:00"],
    ["08:00", "08:00"],
    ["23:00", "23:00"],
    ["00:00", "00:00"],
    ["2:30 PM", "14:30"],
    ["2:30pm", "14:30"],
    ["12:00 AM", "00:00"],
  ])("accepts the valid time %s", (raw, expected) => {
    expect(parseTimeInput(raw)?.format("HH:mm")).toBe(expected)
  })

  it.each([["nope"], ["24:00"], ["23:60"], ["8:0"], ["99:99"], [""], ["  "]])(
    "rejects the invalid input %s",
    raw => {
      expect(parseTimeInput(raw)).toBeNull()
    }
  )
})

describe("isPartialTimeInput (24h)", () => {
  it.each(["", "0", "2", "09", "23", "12", "23:", "23:5", "23:59", "00:00"])(
    "accepts the in-progress 24h time %s",
    raw => {
      expect(isPartialTimeInput(raw, true)).toBe(true)
    }
  )

  it.each([
    ["6"],
    ["9"],
    ["24"],
    ["25"],
    ["687"],
    ["687:09090"],
    ["23:99"],
    ["99:99"],
    ["12:60"],
    ["1:30"],
    ["23:5:9"],
    ["nope"],
  ])("rejects the invalid 24h input %s", raw => {
    expect(isPartialTimeInput(raw, true)).toBe(false)
  })
})

describe("isPartialTimeInput (12h)", () => {
  it.each(["", "0", "12", "12:", "12:30", "12:30 ", "12:30 P", "02:30 am"])(
    "accepts the in-progress 12h time %s",
    raw => {
      expect(isPartialTimeInput(raw, false)).toBe(true)
    }
  )

  it.each([["13"], ["00"], ["9"], ["687"], ["12:99"], ["12:30 X"], ["nope"]])(
    "rejects the invalid 12h input %s",
    raw => {
      expect(isPartialTimeInput(raw, false)).toBe(false)
    }
  )
})

import { afterEach, describe, expect, it, vi } from "vitest"
import dayjs from "dayjs"
import { parseDate, parseTime, stringifyDate, uuid } from "./helpers"

describe("uuid", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("uses crypto.getRandomValues when available", () => {
    const getRandomValues = vi.fn((array: Uint8Array) => {
      array[0] = 0xab
      return array
    })

    vi.stubGlobal("crypto", { getRandomValues })

    expect(uuid()).toMatch(/^c[a-f0-9]{12}4[a-f0-9]{3}[89ab][a-f0-9]{15}$/)
    expect(getRandomValues).toHaveBeenCalled()
  })

  it("falls back to Math.random when crypto is unavailable", () => {
    vi.stubGlobal("crypto", undefined)
    vi.spyOn(Math, "random").mockReturnValue(0)

    expect(uuid()).toMatch(/^c[a-f0-9]{12}4[a-f0-9]{3}[89ab][a-f0-9]{15}$/)
    expect(Math.random).toHaveBeenCalled()
  })
})

describe("date helpers", () => {
  const selectedDate = dayjs("2026-08-05T10:15:30.456")

  it("keeps date-only values unchanged when no time is configured", () => {
    expect(
      stringifyDate(selectedDate, { enableTime: false, setTimeTo: "" })
    ).toBe("2026-08-05")
    expect(stringifyDate(null, { setTimeTo: "23:59:59" })).toBeNull()
  })

  it("applies a configured time to timezone-aware date selections", () => {
    const expected = selectedDate
      .hour(23)
      .minute(59)
      .second(59)
      .millisecond(0)
      .toISOString()

    expect(
      stringifyDate(selectedDate, {
        enableTime: false,
        setTimeTo: "23:59:59",
      })
    ).toBe(expected)
  })

  it("applies a configured time without an offset when ignoring timezones", () => {
    expect(
      stringifyDate(selectedDate, {
        enableTime: false,
        ignoreTimezones: true,
        setTimeTo: "23:59:59",
      })
    ).toBe("2026-08-05T23:59:59.000")
  })

  it("treats malformed configured times as unset", () => {
    expect(
      stringifyDate(selectedDate, {
        enableTime: false,
        setTimeTo: "24:00:00",
      })
    ).toBe("2026-08-05")
    expect(parseTime("12:30")).toBeNull()
  })

  it("parses stored datetime values without discarding their time", () => {
    const value = "2026-08-05T23:59:59.000Z"

    expect(
      parseDate(value, { enableTime: false, setTimeTo: "23:59:59" })?.valueOf()
    ).toBe(dayjs(value).valueOf())
  })
})

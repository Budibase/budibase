import { afterEach, describe, expect, it, vi } from "vitest"
import { getLocaleStartDayOfWeek } from "./utils"

interface LocaleWithWeekInfo {
  readonly weekInfo?: { firstDay?: number }
}

describe("getLocaleStartDayOfWeek", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("uses the locale's first day of the week", () => {
    expect(getLocaleStartDayOfWeek(["en-US"])).toBe("Sunday")
    expect(getLocaleStartDayOfWeek(["en-GB"])).toBe("Monday")
    expect(getLocaleStartDayOfWeek(["ar-AF"])).toBe("Saturday")
    expect(getLocaleStartDayOfWeek(["dv-MV"])).toBe("Friday")
  })

  it("normalizes locale separators", () => {
    expect(getLocaleStartDayOfWeek(["en_US"])).toBe("Sunday")
  })

  it("uses the browser's preferred locales by default", () => {
    vi.stubGlobal("navigator", {
      language: "en-US",
      languages: ["en-US"],
    })

    expect(getLocaleStartDayOfWeek()).toBe("Sunday")
  })

  it("uses the next valid locale", () => {
    expect(getLocaleStartDayOfWeek(["invalid--locale", "en-US"])).toBe("Sunday")
  })

  it("uses region data when locale week information is unavailable", () => {
    const localePrototype: Intl.Locale & LocaleWithWeekInfo =
      Intl.Locale.prototype
    vi.spyOn(localePrototype, "weekInfo", "get").mockReturnValue(undefined)

    expect(getLocaleStartDayOfWeek(["en-US"])).toBe("Sunday")
    expect(getLocaleStartDayOfWeek(["ar-AF"])).toBe("Saturday")
    expect(getLocaleStartDayOfWeek(["dv-MV"])).toBe("Friday")
    expect(getLocaleStartDayOfWeek(["en-GB"])).toBe("Monday")
  })

  it("falls back to Monday without supported locale metadata", () => {
    expect(getLocaleStartDayOfWeek([])).toBe("Monday")
    expect(getLocaleStartDayOfWeek(["invalid--locale"])).toBe("Monday")
  })
})

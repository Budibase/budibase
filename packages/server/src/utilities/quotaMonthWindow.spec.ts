import tk from "timekeeper"

import { getQuotaMonthWindow } from "./quotaMonthWindow"

describe("getQuotaMonthWindow", () => {
  afterEach(() => {
    tk.reset()
  })

  it("returns the local month boundaries", () => {
    tk.freeze(new Date(2026, 0, 20, 12, 0, 0, 0))

    const result = getQuotaMonthWindow()

    expect(result.monthString).toEqual("1-2026")
    expect(result.periodStart).toEqual(
      new Date(2026, 0, 1, 0, 0, 0, 0).toISOString()
    )
    expect(result.periodEnd).toEqual(
      new Date(2026, 1, 1, 0, 0, 0, 0).toISOString()
    )
  })

  it("handles year rollover", () => {
    tk.freeze(new Date(2025, 11, 31, 23, 59, 0, 0))

    const result = getQuotaMonthWindow()

    expect(result.monthString).toEqual("12-2025")
    expect(result.periodStart).toEqual(
      new Date(2025, 11, 1, 0, 0, 0, 0).toISOString()
    )
    expect(result.periodEnd).toEqual(
      new Date(2026, 0, 1, 0, 0, 0, 0).toISOString()
    )
  })
})

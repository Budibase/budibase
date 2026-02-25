import { getQuotaMonthWindow } from "./quotaMonthWindow"

describe("getQuotaMonthWindow", () => {
  it("returns the local month boundaries", () => {
    const result = getQuotaMonthWindow(new Date(2026, 0, 20, 12, 0, 0, 0))

    expect(result.monthString).toEqual("1-2026")
    expect(new Date(result.periodStart)).toEqual(new Date(2026, 0, 1))
    expect(new Date(result.periodEnd)).toEqual(new Date(2026, 1, 1))
  })

  it("handles year rollover", () => {
    const result = getQuotaMonthWindow(new Date(2025, 11, 31, 23, 59, 0, 0))

    expect(result.monthString).toEqual("12-2025")
    expect(new Date(result.periodStart)).toEqual(new Date(2025, 11, 1))
    expect(new Date(result.periodEnd)).toEqual(new Date(2026, 0, 1))
  })
})

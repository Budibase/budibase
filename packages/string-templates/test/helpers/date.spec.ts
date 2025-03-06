import tk from "timekeeper"
import * as date from "../../src/helpers/date"

const frozenDate = new Date("2025-03-06T11:38:41.000Z")
tk.freeze(frozenDate)

describe("date helper", () => {
  describe("difference", () => {
    it("should return the difference between two dates", () => {
      const result = date.difference(
        "2021-01-02T12:34:56.789Z",
        "2021-01-01T01:00:00.000Z"
      )
      const expected =
        1 * 24 * 60 * 60 * 1000 + // 1 day
        11 * 60 * 60 * 1000 + // 11 hours
        34 * 60 * 1000 + // 34 minutes
        56 * 1000 + // seconds
        789 // milliseconds
      expect(result).toEqual(expected)
    })

    it("should be able to set the time unit", () => {
      const result = date.difference(
        "2021-01-02T12:34:56",
        "2021-01-01T01:00:00",
        "days"
      )
      expect(result).toEqual(1)
    })
  })

  describe("durationFromNow", () => {
    it("should return the difference between two close dates", () => {
      const result = date.durationFromNow("2025-03-06T11:38:43.000Z")
      expect(result).toEqual("a few seconds")
    })

    it("should return the difference between two days hours apart", () => {
      const result = date.durationFromNow("2025-03-06T01:00:00.000Z")
      expect(result).toEqual("11 hours")
    })

    it("accepts days in the past", () => {
      const result = date.durationFromNow("2025-03-01")
      expect(result).toEqual("5 days")
    })

    it("accepts days in the future", () => {
      const result = date.durationFromNow("2025-03-08")
      expect(result).toEqual("2 days")
    })
  })
})

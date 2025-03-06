import * as date from "../../src/helpers/date"

describe("date helper", () => {
  describe("difference", () => {
    it("should return the difference between two dates", () => {
      const result = date.difference(
        "2021-01-02T12:34:56.789",
        "2021-01-01T01:00:00"
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
})

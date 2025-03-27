import { isInvalidISODateString } from "../utils"

describe("isInvalidISODateString", () => {
  it("accepts a valid ISO date without a time", () => {
    const invalid = isInvalidISODateString("2013-02-01")
    expect(invalid).toEqual(false)
  })

  it("accepts a valid ISO date with a time", () => {
    const invalid = isInvalidISODateString("2013-02-01T01:23:45Z")
    expect(invalid).toEqual(false)
  })

  it("accepts a valid ISO date with a time and millis", () => {
    const invalid = isInvalidISODateString("2013-02-01T01:23:45.678Z")
    expect(invalid).toEqual(false)
  })

  it("rejects an invalid ISO date", () => {
    const invalid = isInvalidISODateString("2013-523-814T444:22:11Z")
    expect(invalid).toEqual(true)
  })
})

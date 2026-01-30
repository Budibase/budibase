import { isValidISODateString, isValidTime } from "../utils"

describe("ISO date string validity checks", () => {
  it("accepts a valid ISO date string without a time", () => {
    const str = "2013-02-01"
    const valid = isValidISODateString(str)
    expect(valid).toEqual(true)
  })

  it("accepts a valid ISO date string with a time", () => {
    const str = "2013-02-01T01:23:45Z"
    const valid = isValidISODateString(str)
    expect(valid).toEqual(true)
  })

  it("accepts a valid ISO date string with a time and millis", () => {
    const str = "2013-02-01T01:23:45.678Z"
    const valid = isValidISODateString(str)
    expect(valid).toEqual(true)
  })

  it("rejects an invalid ISO date string", () => {
    const str = "2013-523-814T444:22:11Z"
    const valid = isValidISODateString(str)
    expect(valid).toEqual(false)
  })
})

describe("time string validity checks", () => {
  it.each([
    "10:14",
    "10:14:43",
    "10:14.431534",
    "10:14:43.431534",
  ])("accepts %s", value => {
    expect(isValidTime(value)).toEqual(true)
  })

  it.each(["10:14:431534"])("rejects %s", value => {
    expect(isValidTime(value)).toEqual(false)
  })
})

import { isDate } from "../"

describe("isDate", () => {
  it("should handle DD/MM/YYYY", () => {
    expect(isDate("01/01/2001")).toEqual(true)
  })

  it("should handle DD/MM/YY", () => {
    expect(isDate("01/01/01")).toEqual(true)
  })

  it("should handle ISO format YYYY-MM-DD", () => {
    expect(isDate("2001-01-01")).toEqual(true)
  })

  it("should handle ISO format with time (YYYY-MM-DDTHH:MM)", () => {
    expect(isDate("2001-01-01T12:30")).toEqual(true)
  })

  it("should handle ISO format with full timestamp (YYYY-MM-DDTHH:MM:SS)", () => {
    expect(isDate("2001-01-01T12:30:45")).toEqual(true)
  })

  it("should handle complete ISO format", () => {
    expect(isDate("2001-01-01T12:30:00.000Z")).toEqual(true)
  })

  it("should return false for invalid formats", () => {
    expect(isDate("")).toEqual(false)
    expect(isDate("1/10")).toEqual(false)
    expect(isDate("random string")).toEqual(false)
    expect(isDate("123456")).toEqual(false)
  })
})

import { Duration, DurationType } from "../Duration"

describe("duration", () => {
  it("should convert minutes to milliseconds", () => {
    expect(Duration.fromMinutes(5).toMs()).toBe(300000)
  })

  it("should convert seconds to milliseconds", () => {
    expect(Duration.fromSeconds(30).toMs()).toBe(30000)
  })

  it("should convert days to milliseconds", () => {
    expect(Duration.fromDays(1).toMs()).toBe(86400000)
  })

  it("should convert minutes to days", () => {
    expect(Duration.fromMinutes(1440).to(DurationType.DAYS)).toBe(1)
  })
})

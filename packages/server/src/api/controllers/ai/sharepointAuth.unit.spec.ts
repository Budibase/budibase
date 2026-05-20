import { calculateBufferedTokenExpiry } from "./sharepointAuth"
import tk from "timekeeper"

describe("calculateBufferedTokenExpiry", () => {
  beforeEach(() => {
    tk.reset()
  })

  it("applies a 60 second safety buffer for normal token ttl", () => {
    tk.freeze(new Date(1_000_000))

    expect(calculateBufferedTokenExpiry(3600)).toBe(
      1_000_000 + (3600 - 60) * 1000
    )
  })

  it("returns current time when ttl equals the buffer", () => {
    tk.freeze(new Date(2_000_000))

    expect(calculateBufferedTokenExpiry(60)).toBe(2_000_000)
  })

  it("never returns a past expiry when ttl is smaller than the buffer", () => {
    tk.freeze(new Date(3_000_000))

    expect(calculateBufferedTokenExpiry(30)).toBe(3_000_000)
  })
})

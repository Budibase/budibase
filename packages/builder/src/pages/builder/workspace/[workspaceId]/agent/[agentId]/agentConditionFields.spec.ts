import {
  isValidReviewParameterPath,
  normalizeReviewParameterPaths,
} from "./agentConditionFields"

describe("review parameter paths", () => {
  it("validates JSON Pointer syntax", () => {
    expect(isValidReviewParameterPath("/field")).toBe(true)
    expect(isValidReviewParameterPath("/nested/a~1b/~0key/0")).toBe(true)
    expect(isValidReviewParameterPath("field")).toBe(false)
    expect(isValidReviewParameterPath("/invalid~path")).toBe(false)
    expect(isValidReviewParameterPath(`/${"x".repeat(250)}`)).toBe(false)
  })

  it("trims paths and removes duplicates without changing their order", () => {
    expect(
      normalizeReviewParameterPaths([" /second ", "/first", "/second", ""])
    ).toEqual(["/second", "/first"])
  })
})

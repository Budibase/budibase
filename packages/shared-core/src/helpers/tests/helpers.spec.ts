import { normalizeForComparison } from "../helpers"

describe("helpers", () => {
  describe("normalizeForComparison", () => {
    it("trims and lowercases a string", () => {
      expect(normalizeForComparison("  Hello WORLD  ")).toBe("hello world")
    })
  })
})

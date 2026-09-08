import { JSONLimitError, validateJSONLimits } from "./jsonLimits"

describe("validateJSONLimits", () => {
  const limits = { maxBytes: 100, maxDepth: 10 }

  it.each([null, false, "value", 42])("accepts %s", value => {
    expect(() => validateJSONLimits(value, limits)).not.toThrow()
  })

  it("accepts nested objects and arrays within the depth limit", () => {
    expect(() =>
      validateJSONLimits(
        { rows: [{ id: "row-1" }] },
        { maxBytes: 100, maxDepth: 3 }
      )
    ).not.toThrow()
  })

  it("rejects values deeper than the depth limit", () => {
    expect(() =>
      validateJSONLimits(
        { rows: [{ id: "row-1" }] },
        { maxBytes: 100, maxDepth: 2 }
      )
    ).toThrow(JSONLimitError)
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects the non-finite number %s",
    value => {
      expect(() => validateJSONLimits(value, limits)).toThrow(JSONLimitError)
    }
  )

  it("accepts values at the byte limit", () => {
    expect(() =>
      validateJSONLimits("é", { maxBytes: 4, maxDepth: 10 })
    ).not.toThrow()
  })

  it("rejects values over the byte limit", () => {
    expect(() =>
      validateJSONLimits("é", { maxBytes: 3, maxDepth: 10 })
    ).toThrow(JSONLimitError)
  })
})

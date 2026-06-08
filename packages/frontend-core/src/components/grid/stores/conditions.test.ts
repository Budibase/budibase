import { describe, expect, it, vi } from "vitest"

vi.mock("../../../utils", () => ({
  derivedMemo: value => value,
  QueryUtils: {},
}))

import { getGridEvaluatableConditions } from "./conditions"

describe("grid condition evaluation helpers", () => {
  it("filters disabled conditions when disabled conditions should be honoured", () => {
    const conditions = [
      { disabled: true },
      { disabled: false },
      { disabled: true },
    ]

    expect(getGridEvaluatableConditions(conditions, true)).toEqual([
      { disabled: false },
    ])
  })

  it("keeps disabled conditions when disabled conditions should not be honoured", () => {
    const conditions = [{ disabled: true }, { disabled: false }]

    expect(getGridEvaluatableConditions(conditions, false)).toEqual(conditions)
  })

  it("returns an empty array when no conditions are supplied", () => {
    expect(getGridEvaluatableConditions(undefined, true)).toEqual([])
    expect(getGridEvaluatableConditions([], false)).toEqual([])
  })
})

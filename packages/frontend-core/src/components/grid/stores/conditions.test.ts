import { describe, expect, it, vi } from "vitest"
import type { UICondition } from "@budibase/types"

vi.mock("../../../utils", () => ({
  derivedMemo: (value: unknown) => value,
  QueryUtils: {},
}))

import { getEnabledConditions } from "./conditions"

describe("grid condition evaluation helpers", () => {
  it("filters disabled conditions", () => {
    const conditions = [
      { disabled: true },
      { disabled: false },
      { disabled: true },
    ] as UICondition[]

    expect(getEnabledConditions(conditions)).toEqual([{ disabled: false }])
  })

  it("returns an empty array when no conditions are supplied", () => {
    expect(getEnabledConditions(undefined)).toEqual([])
    expect(getEnabledConditions([])).toEqual([])
  })
})

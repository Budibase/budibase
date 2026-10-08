import { describe, expect, it } from "vitest"
import { getPaginationLabel } from "./pagination"

describe("getPaginationLabel", () => {
  it("describes the range shown on the current page", () => {
    expect(
      getPaginationLabel({ page: 3, pageSize: 20, rowCount: 5, total: 45 })
    ).toBe("Showing 41–45 of 45 items")
  })

  it("describes an empty page", () => {
    expect(
      getPaginationLabel({ page: 1, pageSize: 20, rowCount: 0, total: 0 })
    ).toBe("Showing 0 items")
  })
})

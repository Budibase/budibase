import * as search from "../../app/rows/search"

describe("removeEmptyFilters", () => {
  it("0 should not be removed", () => {
    const filters = search.removeEmptyFilters({
      equal: {
        column: 0,
      },
    })
    expect((filters.equal as any).column).toBe(0)
  })

  it("empty string should be removed", () => {
    const filters = search.removeEmptyFilters({
      equal: {
        column: "",
      },
    })
    expect(Object.values(filters.equal as any).length).toBe(0)
  })
})

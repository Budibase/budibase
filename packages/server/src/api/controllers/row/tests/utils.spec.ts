import * as utils from "../utils"

describe("removeEmptyFilters", () => {
  it("0 should not be removed", () => {
    const filters = utils.removeEmptyFilters({
      equal: {
        column: 0,
      },
    })
    expect((filters.equal as any).column).toBe(0)
  })

  it("empty string should be removed", () => {
    const filters = utils.removeEmptyFilters({
      equal: {
        column: "",
      },
    })
    expect(Object.values(filters.equal as any).length).toBe(0)
  })
})

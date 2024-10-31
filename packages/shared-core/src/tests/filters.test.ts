import { readableFilters } from "../filters"
import { EmptyFilterOption } from "@budibase/types"

describe("Readable filters", () => {
  it("basic filters", () => {
    const output = readableFilters({
      $and: {
        conditions: [{ equal: { name: "hello" } }, { equal: { number: 1 } }],
      },
    })
    expect(output).toBe("name equals hello and number equals 1")
  })

  it("range filters", () => {
    const output = readableFilters({
      $or: {
        conditions: [
          { range: { date: { low: 1 } } },
          { range: { date: { low: 10, high: 20 } } },
        ],
      },
    })
    expect(output).toBe(
      "date is greater than or equal to 1 or date is between 10 and 20"
    )
  })

  it("empty filters", () => {
    const output = readableFilters({
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
      $and: {
        conditions: [],
      },
    })

    expect(output).toBe("")
  })
})

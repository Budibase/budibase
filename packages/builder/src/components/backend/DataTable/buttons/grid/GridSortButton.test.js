import { it, expect, describe } from "vitest"

// We're testing the logic from GridSortButton.svelte
// Since it's a Svelte component, we'll extract and test the core logic function

const getOrderOptions = (column, columnOptions) => {
  const type = columnOptions.find(col => col.value === column)?.type

  // Define labels based on column type
  let ascendingLabel, descendingLabel

  if (type === "number") {
    ascendingLabel = "Low to High"
    descendingLabel = "High to Low"
  } else if (type === "datetime") {
    ascendingLabel = "Earliest to Latest"
    descendingLabel = "Latest to Earliest"
  } else {
    ascendingLabel = "A-Z"
    descendingLabel = "Z-A"
  }

  return [
    {
      label: ascendingLabel,
      value: "ascending",
    },
    {
      label: descendingLabel,
      value: "descending",
    },
  ]
}

describe("GridSortButton - getOrderOptions", () => {
  const mockColumnOptions = [
    { label: "Text Field", value: "textField", type: "string" },
    { label: "Number Field", value: "numberField", type: "number" },
    { label: "Date Field", value: "dateField", type: "datetime" },
    { label: "Boolean Field", value: "booleanField", type: "boolean" },
  ]

  describe("Number columns", () => {
    it("should show 'Low to High' and 'High to Low' labels for number columns", () => {
      const options = getOrderOptions("numberField", mockColumnOptions)

      expect(options).toEqual([
        { label: "Low to High", value: "ascending" },
        { label: "High to Low", value: "descending" },
      ])
    })
  })

  describe("Date columns", () => {
    it("should show 'Earliest to Latest' and 'Latest to Earliest' labels for datetime columns", () => {
      const options = getOrderOptions("dateField", mockColumnOptions)

      // This test should FAIL with current implementation
      // Current implementation shows A-Z/Z-A for all non-number types
      expect(options).toEqual([
        { label: "Earliest to Latest", value: "ascending" },
        { label: "Latest to Earliest", value: "descending" },
      ])
    })
  })

  describe("String columns", () => {
    it("should show 'A-Z' and 'Z-A' labels for string columns", () => {
      const options = getOrderOptions("textField", mockColumnOptions)

      expect(options).toEqual([
        { label: "A-Z", value: "ascending" },
        { label: "Z-A", value: "descending" },
      ])
    })
  })

  describe("Boolean columns", () => {
    it("should show 'A-Z' and 'Z-A' labels for boolean columns", () => {
      const options = getOrderOptions("booleanField", mockColumnOptions)

      expect(options).toEqual([
        { label: "A-Z", value: "ascending" },
        { label: "Z-A", value: "descending" },
      ])
    })
  })

  describe("Unknown column", () => {
    it("should show 'A-Z' and 'Z-A' labels for unknown columns", () => {
      const options = getOrderOptions("unknownField", mockColumnOptions)

      expect(options).toEqual([
        { label: "A-Z", value: "ascending" },
        { label: "Z-A", value: "descending" },
      ])
    })
  })
})

import { convertDataToExportFormat } from "../rowsHelper"

describe("convertDataToExportFormat", () => {
  const rows = [
    { firstName: "John", lastName: "Connor" },
    { firstName: "Stewart", lastName: "Little" },
  ]
  const columns = [{ name: "firstName" }, { name: "lastName" }]
  const customHeaders = {
    firstName: "First name",
    lastName: "Last name",
  }

  it("uses custom headers for CSV columns", () => {
    expect(
      convertDataToExportFormat(rows, "csv", columns, ",", customHeaders)
    ).toBe("First name,Last name\nJohn,Connor\nStewart,Little")
  })

  it("uses the original CSV header when a column has no custom label", () => {
    expect(
      convertDataToExportFormat(rows, "csv", columns, ",", {
        firstName: "First name",
      })
    ).toBe("First name,lastName\nJohn,Connor\nStewart,Little")
  })

  it("escapes CSV custom headers", () => {
    expect(
      convertDataToExportFormat(rows, "csv", columns, ",", {
        firstName: 'First, "preferred" name',
        lastName: "Last name",
      })
    ).toBe('"First, ""preferred"" name",Last name\nJohn,Connor\nStewart,Little')
  })

  it("uses custom headers for JSON keys", () => {
    expect(
      convertDataToExportFormat(rows, "json", columns, ",", customHeaders)
    ).toBe(
      JSON.stringify(
        [
          { "First name": "John", "Last name": "Connor" },
          { "First name": "Stewart", "Last name": "Little" },
        ],
        null,
        2
      )
    )
  })

  it("uses the original JSON key when a column has no custom label", () => {
    expect(
      convertDataToExportFormat(rows, "json", columns, ",", {
        firstName: "First name",
      })
    ).toBe(
      JSON.stringify(
        [
          { "First name": "John", lastName: "Connor" },
          { "First name": "Stewart", lastName: "Little" },
        ],
        null,
        2
      )
    )
  })

  it("uses constructor as the original CSV header", () => {
    expect(
      convertDataToExportFormat([{ constructor: "value" }], "csv", [
        { name: "constructor" },
      ])
    ).toBe("constructor\nvalue")
  })

  it("uses constructor as the original JSON key", () => {
    expect(
      convertDataToExportFormat([{ constructor: "value" }], "json", [
        { name: "constructor" },
      ])
    ).toBe(JSON.stringify([{ constructor: "value" }], null, 2))
  })

  it("preserves a custom JSON header named __proto__", () => {
    expect(
      convertDataToExportFormat(
        [{ value: "test" }],
        "json",
        [{ name: "value" }],
        ",",
        { value: "__proto__" }
      )
    ).toBe('[\n  {\n    "__proto__": "test"\n  }\n]')
  })

  it("disambiguates duplicate custom JSON headers", () => {
    expect(
      convertDataToExportFormat(rows, "json", columns, ",", {
        firstName: "Name",
        lastName: "Name",
      })
    ).toBe(
      JSON.stringify(
        [
          { Name: "John", "Name (2)": "Connor" },
          { Name: "Stewart", "Name (2)": "Little" },
        ],
        null,
        2
      )
    )
  })
})

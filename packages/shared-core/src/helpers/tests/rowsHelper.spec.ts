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
})

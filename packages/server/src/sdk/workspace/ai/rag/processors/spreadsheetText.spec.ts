import * as XLSX from "xlsx"
import {
  prepareKnowledgeFileForRagIngestion,
  stringifySpreadsheetForRag,
} from "./spreadsheetText"

const buildWorkbookBuffer = (
  sheets: Array<{ name: string; rows: Array<Array<string | number>> }>
) => {
  const workbook = XLSX.utils.book_new()

  for (const sheet of sheets) {
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet(sheet.rows),
      sheet.name
    )
  }

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
}

describe("spreadsheetText", () => {
  it("stringifies sheets as header-aware row blocks", () => {
    const buffer = buildWorkbookBuffer([
      {
        name: "Plans",
        rows: [
          ["Plan", "Seats", "Price"],
          ["Free", 1, 0],
          ["Pro", 10, 49],
        ],
      },
      {
        name: "Contacts",
        rows: [
          ["Name", "Team"],
          ["Jess", "Support"],
        ],
      },
    ])

    const result = stringifySpreadsheetForRag("pricing.xlsx", buffer)

    expect(result).toContain("Workbook: pricing.xlsx")
    expect(result).toContain("Sheet: Plans")
    expect(result).toContain("Columns: Plan | Seats | Price")
    expect(result).toContain("Row 2")
    expect(result).toContain("Plan: Free")
    expect(result).toContain("Seats: 1")
    expect(result).toContain("Price: 49")
    expect(result).toContain("Sheet: Contacts")
    expect(result).toContain("Name: Jess")
    expect(result).toContain("Team: Support")
  })

  it("uses fallback labels for blank or duplicate headers and single-row sheets", () => {
    const buffer = buildWorkbookBuffer([
      {
        name: "Statuses",
        rows: [
          ["", "Status", "Status"],
          ["Alice", "Active", "Pending"],
        ],
      },
      {
        name: "Notes",
        rows: [["Only one value", "Second value"]],
      },
    ])

    const result = stringifySpreadsheetForRag("status.xlsx", buffer)

    expect(result).toContain("Columns: Column 1 | Status | Status 2")
    expect(result).toContain("Column 1: Alice")
    expect(result).toContain("Status: Active")
    expect(result).toContain("Status 2: Pending")
    expect(result).toContain("Sheet: Notes")
    expect(result).toContain("Row 1")
    expect(result).toContain("Column 1: Only one value")
    expect(result).toContain("Column 2: Second value")
  })

  it("converts spreadsheet uploads into plain text payloads", () => {
    const buffer = buildWorkbookBuffer([
      {
        name: "Plans",
        rows: [
          ["Plan", "Price"],
          ["Pro", 49],
        ],
      },
    ])

    const result = prepareKnowledgeFileForRagIngestion({
      filename: "pricing.xlsx",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer,
    })

    expect(result.filename).toBe("pricing.xlsx")
    expect(result.mimetype).toBe("text/plain")
    expect(result.buffer.toString("utf8")).toContain("Plan: Pro")
  })
})

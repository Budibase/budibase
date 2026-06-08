import * as XLSX from "xlsx"
import {
  prepareTabularKnowledgeFileForRagIngestion,
  searchTabularRowsForExactMatches,
  stringifyRowsForRag,
  stringifyTabularFileForRag,
} from "./tabularText"

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

describe("tabularText", () => {
  it("stringifies row sections independently from file parsing", () => {
    const result = stringifyRowsForRag({
      documentLabel: "File: inventory.csv",
      sections: [
        {
          label: "Table: inventory.csv",
          values: [
            ["Product", "Stock"],
            ["Desk", "8"],
          ],
        },
      ],
    })

    expect(result).toContain("File: inventory.csv")
    expect(result).toContain("Table: inventory.csv")
    expect(result).toContain("Columns: Product | Stock")
    expect(result).toContain("Row 2 in inventory.csv")
    expect(result).toContain("Product: Desk")
    expect(result).toContain("Stock: 8")
  })

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

    const result = stringifyTabularFileForRag("pricing.xlsx", buffer)

    expect(result).toContain("Workbook: pricing.xlsx")
    expect(result).toContain("Sheet: Plans")
    expect(result).toContain("Columns: Plan | Seats | Price")
    expect(result).toContain("Row 2 in Sheet Plans")
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

    const result = stringifyTabularFileForRag("status.xlsx", buffer)

    expect(result).toContain("Columns: Column 1 | Status | Status 2")
    expect(result).toContain("Column 1: Alice")
    expect(result).toContain("Status: Active")
    expect(result).toContain("Status 2: Pending")
    expect(result).toContain("Sheet: Notes")
    expect(result).toContain("Row 1 in Sheet Notes")
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

    const result = prepareTabularKnowledgeFileForRagIngestion({
      filename: "pricing.xlsx",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer,
    })

    expect(result.filename).toBe("pricing.xlsx")
    expect(result.mimetype).toBe("text/plain")
    expect(result.buffer.toString("utf8")).toContain("Plan: Pro")
    expect(result.buffer.toString("utf8")).toContain("Price: 49")
  })

  it("converts CSV uploads into header-aware row blocks", () => {
    const buffer = Buffer.from(
      [
        "Name,Team,Notes",
        'Jess,Support,"Handles billing, refunds"',
        "Sam,Sales,Enterprise accounts",
      ].join("\n"),
      "utf8"
    )

    const result = prepareTabularKnowledgeFileForRagIngestion({
      filename: "contacts.csv",
      mimetype: "text/csv",
      buffer,
    })
    const text = result.buffer.toString("utf8")

    expect(result.filename).toBe("contacts.csv")
    expect(result.mimetype).toBe("text/plain")
    expect(text).toContain("File: contacts.csv")
    expect(text).toContain("Table: contacts.csv")
    expect(text).toContain("Columns: Name | Team | Notes")
    expect(text).toContain("Row 2 in contacts.csv")
    expect(text).toContain("Name: Jess")
    expect(text).toContain("Team: Support")
    expect(text).toContain("Notes: Handles billing, refunds")
    expect(text).toContain("Name: Sam")
  })

  it("converts TSV uploads detected by mimetype", () => {
    const buffer = Buffer.from(
      ["Name\tTeam", "Lee\tEngineering"].join("\n"),
      "utf8"
    )

    const result = prepareTabularKnowledgeFileForRagIngestion({
      filename: "team-data",
      mimetype: "text/tab-separated-values",
      buffer,
    })
    const text = result.buffer.toString("utf8")

    expect(result.filename).toBe("team-data")
    expect(result.mimetype).toBe("text/plain")
    expect(text).toContain("File: team-data")
    expect(text).toContain("Table: team-data")
    expect(text).toContain("Columns: Name | Team")
    expect(text).toContain("Row 2 in team-data")
    expect(text).toContain("Name: Lee")
    expect(text).toContain("Team: Engineering")
  })

  it("returns exact row matches for tabular lookup questions", () => {
    const buffer = buildWorkbookBuffer([
      {
        name: "Users",
        rows: [
          ["Name", "Age", "Favorite number", "Is admin"],
          ["User 99", 75, 63, 0],
          ["User 991", 40, 66, 1],
        ],
      },
    ])

    const result = searchTabularRowsForExactMatches({
      filename: "users.xlsx",
      buffer,
      query: "What are the details for User 991?",
    })

    expect(result).toHaveLength(1)
    expect(result[0].chunkText).toContain(
      "Exact tabular match from Workbook: users.xlsx"
    )
    expect(result[0].chunkText).toContain("Row 3 in Sheet Users")
    expect(result[0].chunkText).toContain("Name: User 991")
    expect(result[0].chunkText).toContain("Age: 40")
    expect(result[0].chunkText).toContain("Favorite number: 66")
    expect(result[0].chunkText).toContain("Is admin: 1")
    expect(result[0].chunkText).not.toContain("Age: 75")
  })

  it("returns multiple exact row matches from one query", () => {
    const buffer = buildWorkbookBuffer([
      {
        name: "Users",
        rows: [
          ["Name", "Age", "Favorite number", "Is admin"],
          ["User 990", 61, 40, 1],
          ["User 991", 40, 66, 1],
          ["User 992", 37, 79, 1],
        ],
      },
    ])

    const result = searchTabularRowsForExactMatches({
      filename: "users.xlsx",
      buffer,
      query: "Compare User 991 and User 992",
    })

    expect(result).toHaveLength(2)
    expect(result[0].chunkText).toContain("Name: User 991")
    expect(result[0].chunkText).toContain("Age: 40")
    expect(result[1].chunkText).toContain("Name: User 992")
    expect(result[1].chunkText).toContain("Age: 37")
    expect(result.map(match => match.chunkText).join("\n")).not.toContain(
      "Name: User 990"
    )
  })

  it("returns multiple rows for exact column value lookups", () => {
    const buffer = buildWorkbookBuffer([
      {
        name: "Users",
        rows: [
          ["Name", "Age", "Favorite number", "Is admin"],
          ["User 990", 61, 40, 1],
          ["User 991", 40, 66, 1],
          ["User 992", 37, 79, 0],
          ["User 993", 68, 25, 1],
        ],
      },
    ])

    const result = searchTabularRowsForExactMatches({
      filename: "users.xlsx",
      buffer,
      query: "Show rows where Is admin is 1",
    })

    expect(result).toHaveLength(3)
    expect(result[0].chunkText).toContain("Name: User 990")
    expect(result[1].chunkText).toContain("Name: User 991")
    expect(result[2].chunkText).toContain("Name: User 993")
    expect(result.map(match => match.chunkText).join("\n")).not.toContain(
      "Name: User 992"
    )
  })

  it("does not match short numeric cells during exact row lookup", () => {
    const buffer = buildWorkbookBuffer([
      {
        name: "Users",
        rows: [
          ["Name", "Age"],
          ["Alice", 40],
        ],
      },
    ])

    const result = searchTabularRowsForExactMatches({
      filename: "users.xlsx",
      buffer,
      query: "What does 40 mean?",
    })

    expect(result).toEqual([])
  })
})

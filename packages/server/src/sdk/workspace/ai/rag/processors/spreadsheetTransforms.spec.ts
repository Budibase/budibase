import * as XLSX from "xlsx"
import { buildSpreadsheetIngestVariants } from "./spreadsheetTransforms"

const createWorkbookBuffer = (
  dataRows: unknown[][] = [
    ["Alice", "Engineer", "London"],
    ["Bob", "Designer", "New York"],
  ]
) => {
  const workbook = XLSX.utils.book_new()
  const sheet = XLSX.utils.aoa_to_sheet([
    ["Name", "Role", "Office"],
    ...dataRows,
  ])
  XLSX.utils.book_append_sheet(workbook, sheet, "Team")
  return XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  }) as Buffer
}

describe("spreadsheetTransforms", () => {
  it("builds native and row batch variants for spreadsheets", () => {
    const variants = buildSpreadsheetIngestVariants({
      filename: "team.xlsx",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer: createWorkbookBuffer(),
    })

    expect(variants.map(variant => variant.strategy)).toEqual([
      "native",
      "row_batch",
    ])
    expect(variants[1].buffer.toString("utf8")).toContain(
      "Row 2: Name=Alice | Role=Engineer | Office=London"
    )
    expect(variants[1].buffer.toString("utf8")).toContain(
      "Columns: Name | Role | Office"
    )
  })

  it("splits large spreadsheets into 100-row text batches", () => {
    const rows = Array.from({ length: 105 }, (_, index) => [
      `Person ${index + 1}`,
      index === 104 ? "Customer Support" : "Engineer",
      "London",
    ])

    const variants = buildSpreadsheetIngestVariants({
      filename: "team.xlsx",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer: createWorkbookBuffer(rows),
    })

    expect(variants.map(variant => variant.strategy)).toEqual([
      "native",
      "row_batch",
      "row_batch",
    ])
    expect(variants[1].buffer.toString("utf8")).toContain("Rows: 2-101")
    expect(variants[2].buffer.toString("utf8")).toContain("Rows: 102-106")
    expect(variants[2].buffer.toString("utf8")).toContain(
      "Row 106: Name=Person 105 | Role=Customer Support | Office=London"
    )
  })

  it("does not truncate rows to the first short title row", () => {
    const workbook = XLSX.utils.book_new()
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Team directory"],
      ["Name", "Role", "Office"],
      ["Alice", "Customer Support", "London"],
    ])
    XLSX.utils.book_append_sheet(workbook, sheet, "Team")
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    }) as Buffer

    const variants = buildSpreadsheetIngestVariants({
      filename: "team.xlsx",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer,
    })

    expect(variants[1].buffer.toString("utf8")).toContain(
      "Columns: Name | Role | Office"
    )
    expect(variants[1].buffer.toString("utf8")).toContain(
      "Row 3: Name=Alice | Role=Customer Support | Office=London"
    )
  })

  it("passes through non-spreadsheet files unchanged", () => {
    const buffer = Buffer.from("plain text")
    const variants = buildSpreadsheetIngestVariants({
      filename: "notes.txt",
      mimetype: "text/plain",
      buffer,
    })

    expect(variants).toEqual([
      {
        strategy: "native",
        filename: "notes.txt",
        mimetype: "text/plain",
        buffer,
      },
    ])
  })
})

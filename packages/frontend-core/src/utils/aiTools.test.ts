import { describe, expect, it } from "vitest"
import { formatToolName } from "./aiTools"

describe("formatToolName", () => {
  it("uses readable names to split source and action", () => {
    expect(formatToolName("ta_123_list_rows", "Research Notes.list_rows")).toEqual(
      {
        full: "Research Notes - List Rows",
        primary: "Research Notes",
        secondary: "List Rows",
      }
    )
  })

  it("humanizes raw tool names when no readable name exists", () => {
    expect(formatToolName("list_tables")).toEqual({
      full: "List Tables",
      primary: "List Tables",
    })
  })
})

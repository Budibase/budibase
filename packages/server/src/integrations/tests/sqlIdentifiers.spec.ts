import {
  quoteMySqlIdentifier,
  quotePostgresIdentifier,
} from "../utils/sqlIdentifiers"

describe("sql identifiers", () => {
  it("quotes postgres identifiers", () => {
    expect(quotePostgresIdentifier(`safe"; SELECT pg_sleep(1); --`)).toBe(
      `"safe""; SELECT pg_sleep(1); --"`
    )
  })

  it("quotes mysql identifiers", () => {
    expect(quoteMySqlIdentifier("safe`; SELECT SLEEP(1); --")).toBe(
      "`safe``; SELECT SLEEP(1); --`"
    )
  })
})

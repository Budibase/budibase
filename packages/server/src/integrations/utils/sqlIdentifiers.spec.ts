import {
  quoteMySqlIdentifier,
  quoteOracleIdentifier,
  quotePostgresIdentifier,
  quoteSqlServerIdentifier,
} from "./sqlIdentifiers"

describe("sql identifiers", () => {
  it("quotes postgres identifiers", () => {
    expect(quotePostgresIdentifier(`safe"; SELECT pg_sleep(1); --`)).toBe(
      `"safe""; SELECT pg_sleep(1); --"`
    )
  })

  it("quotes oracle identifiers", () => {
    expect(
      quoteOracleIdentifier(`safe"; SELECT username FROM dba_users; --`)
    ).toBe(`"safe""; SELECT username FROM dba_users; --"`)
  })

  it("quotes mysql identifiers", () => {
    expect(quoteMySqlIdentifier("safe`; SELECT SLEEP(1); --")).toBe(
      "`safe``; SELECT SLEEP(1); --`"
    )
  })

  it("quotes sql server identifiers", () => {
    expect(quoteSqlServerIdentifier("safe]; SELECT 1; --")).toBe(
      "[safe]]; SELECT 1; --]"
    )
  })
})

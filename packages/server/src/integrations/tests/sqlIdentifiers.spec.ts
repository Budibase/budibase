import { quotePostgresIdentifier } from "../utils/sqlIdentifiers"

describe("sql identifiers", () => {
  it("quotes postgres identifiers", () => {
    expect(quotePostgresIdentifier(`safe"; SELECT pg_sleep(1); --`)).toBe(
      `"safe""; SELECT pg_sleep(1); --"`
    )
  })

})

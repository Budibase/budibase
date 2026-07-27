jest.mock("../../sdk", () => ({
  __esModule: true,
  default: {
    queries: {
      enrichContext: jest.fn(
        async (bindings: string[], parameters: Record<string, any>) =>
          bindings.map(binding => parameters[binding.replace(/[{} ]/g, "")])
      ),
      enrichArrayContext: jest.fn(
        async (bindings: string[], parameters: Record<string, any>) =>
          bindings.map(binding => parameters[binding.replace(/[{} ]/g, "")])
      ),
    },
  },
}))

import { SourceName } from "@budibase/types"
import { interpolateSQL } from "../queries/sql"

describe("interpolateSQL SQL injection hardening", () => {
  const mysqlIntegration = {
    getBindingIdentifier: () => "?",
    getStringConcat: (parts: string[]) => `concat(${parts.join(", ")})`,
  }

  it("prevents a MySQL binding from injecting an extra statement into the final SQL", async () => {
    const fields = {
      sql: "SELECT * FROM users WHERE id = {{ id }}",
      bindings: [],
    }

    const result = await interpolateSQL(
      SourceName.MYSQL,
      fields,
      { id: "1; DROP TABLE users; --" },
      mysqlIntegration as any,
      { nullDefaultSupport: false }
    )

    expect(result.sql).toBe("SELECT * FROM users WHERE id = ?")
    expect(result.sql).not.toContain("DROP TABLE")
    expect(result.bindings).toEqual(["1; DROP TABLE users; --"])
  })

  it("prevents a quoted MySQL binding from smuggling an extra statement into the final SQL", async () => {
    const fields = {
      sql: "SELECT * FROM users WHERE name = '{{ name }}'",
      bindings: [],
    }

    const result = await interpolateSQL(
      SourceName.MYSQL,
      fields,
      { name: "'; DROP TABLE users; --" },
      mysqlIntegration as any,
      { nullDefaultSupport: false }
    )

    expect(result.sql).toBe(
      "SELECT * FROM users WHERE name = concat('', ?, '')"
    )
    expect(result.sql).not.toContain("DROP TABLE")
    expect(result.bindings).toEqual(["'; DROP TABLE users; --"])
  })
})

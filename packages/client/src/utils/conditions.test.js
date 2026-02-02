import { describe, expect, it } from "vitest"
import { enrichGridConditions } from "./conditions"

describe("enrichGridConditions", () => {
  it("enriches row and current user bindings in conditions", () => {
    const context = {
      user: { roleId: "ADMIN" },
      table1: { name: "Row 1" },
    }

    const [condition] = enrichGridConditions(
      [
        {
          referenceValue: "{{ [user].[roleId] }}",
          newValue: "{{ [table1].[name] }}",
        },
      ],
      context
    )

    expect(condition.referenceValue).toEqual("ADMIN")
    expect(condition.newValue).toEqual("Row 1")
  })
})

// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import {
  enrichGridConditions,
  getEnabledConditions,
  getActiveConditions,
} from "./conditions"

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

describe("getActiveConditions", () => {
  it("ignores disabled conditions", () => {
    const active = getActiveConditions([
      {
        disabled: true,
        valueType: "string",
        operator: "equal",
        referenceValue: "x",
        newValue: "x",
      },
    ])

    expect(active).toEqual([])
  })
})

describe("getEnabledConditions", () => {
  it("filters disabled conditions", () => {
    const conditions = [{ disabled: true }, { disabled: false }]

    expect(getEnabledConditions(conditions)).toEqual([{ disabled: false }])
  })
})

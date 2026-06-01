// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import {
  enrichGridConditions,
  getEvaluatableConditions,
  getActiveConditions,
  shouldHonorDisabledConditions,
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

  it("ignores disabled flag when disabled handling is turned off", () => {
    const active = getActiveConditions(
      [
        {
          disabled: true,
          valueType: "string",
          operator: "equal",
          referenceValue: "x",
          newValue: "x",
        },
      ],
      { honorDisabledConditions: false }
    )

    expect(active).toHaveLength(1)
  })
})

describe("disabled condition helpers", () => {
  it("derives whether disabled conditions should be honored", () => {
    expect(
      shouldHonorDisabledConditions({ inBuilder: true, isDevApp: false })
    ).toEqual(true)
    expect(
      shouldHonorDisabledConditions({ inBuilder: false, isDevApp: true })
    ).toEqual(true)
    expect(
      shouldHonorDisabledConditions({ inBuilder: false, isDevApp: false })
    ).toEqual(false)
  })

  it("returns evaluatable conditions based on disabled handling mode", () => {
    const conditions = [{ disabled: true }, { disabled: false }]
    expect(
      getEvaluatableConditions(conditions, { honorDisabledConditions: true })
    ).toEqual([{ disabled: false }])
    expect(
      getEvaluatableConditions(conditions, { honorDisabledConditions: false })
    ).toEqual(conditions)
  })
})

import { automations } from "@budibase/shared-core"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

const FilterConditions = automations.steps.filter.FilterConditions

function stringToFilterCondition(condition: "==" | "!=" | ">" | "<"): string {
  switch (condition) {
    case "==":
      return FilterConditions.EQUAL
    case "!=":
      return FilterConditions.NOT_EQUAL
    case ">":
      return FilterConditions.GREATER_THAN
    case "<":
      return FilterConditions.LESS_THAN
  }
}

type TestCase = [any, "==" | "!=" | ">" | "<", any]

describe("test the filter logic", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  const pass: TestCase[] = [
    [10, ">", 5],
    ["10", ">", 5],
    [10, ">", "5"],
    ["10", ">", "5"],
    [10, "==", 10],
    [10, "<", 15],
    ["hello", "==", "hello"],
    ["hello", "!=", "no"],
    [new Date().toISOString(), ">", new Date(-10000).toISOString()],
  ]
  it.each(pass)("should pass %p %p %p", async (field, condition, value) => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .filter({ field, condition: stringToFilterCondition(condition), value })
      .test({ fields: {} })

    expect(result.steps[0].outputs.result).toEqual(true)
    expect(result.steps[0].outputs.success).toEqual(true)
  })

  const fail: TestCase[] = [
    [10, ">", 15],
    [10, "<", 5],
    [10, "==", 5],
    ["hello", "==", "no"],
    ["hello", "!=", "hello"],
    [{}, "==", {}],
  ]
  it.each(fail)("should fail %p %p %p", async (field, condition, value) => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .filter({ field, condition: stringToFilterCondition(condition), value })
      .test({ fields: {} })

    expect(result.steps[0].outputs.result).toEqual(false)
    expect(result.steps[0].outputs.success).toEqual(true)
  })
})

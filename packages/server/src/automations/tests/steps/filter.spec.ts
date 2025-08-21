import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { FilterCondition } from "@budibase/types"

function stringToFilterCondition(
  condition: "==" | "!=" | ">" | "<"
): FilterCondition {
  switch (condition) {
    case "==":
      return FilterCondition.EQUAL
    case "!=":
      return FilterCondition.NOT_EQUAL
    case ">":
      return FilterCondition.GREATER_THAN
    case "<":
      return FilterCondition.LESS_THAN
    default:
      throw new Error(`Unsupported condition: ${condition}`)
  }
}

type TestCase = [any, "==" | "!=" | ">" | "<", any]

describe("test the filter logic", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
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

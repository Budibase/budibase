import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { AutomationStatus, FilterCondition } from "@budibase/types"
import { run } from "../../steps/filter"

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

  it.each([
    ["5", FilterCondition.EQUAL, 5, true, 5, 5],
    [true, FilterCondition.NOT_EQUAL, "true", true, true, "true"],
    [
      "2024-01-02T00:00:00.000Z",
      FilterCondition.GREATER_THAN,
      "2024-01-01T00:00:00.000Z",
      true,
      Date.parse("2024-01-02T00:00:00.000Z"),
      Date.parse("2024-01-01T00:00:00.000Z"),
    ],
    [5, FilterCondition.LESS_THAN, 10, true, 5, 10],
    [
      { name: "Jane" },
      FilterCondition.EQUAL,
      { name: "Jane" },
      false,
      {
        name: "Jane",
      },
      { name: "Jane" },
    ],
  ])(
    "should compare inputs directly for %p %p %p",
    async (
      field,
      condition,
      value,
      expectedResult,
      expectedRefValue,
      expectedComparisonValue
    ) => {
      const result = await createAutomationBuilder(config)
        .onAppAction()
        .filter({
          field,
          condition,
          value,
        })
        .test({ fields: {} })

      const expectedOutput: Record<string, unknown> = {
        success: true,
        result: expectedResult,
        refValue: expectedRefValue,
        comparisonValue: expectedComparisonValue,
      }
      if (!expectedResult) {
        expectedOutput.status = AutomationStatus.STOPPED
      }

      expect(result.steps[0].outputs).toEqual(expectedOutput)
    }
  )

  it("should return a failed result when comparison throws", async () => {
    const result = await run({
      inputs: {
        field: Symbol("field"),
        condition: FilterCondition.EQUAL,
        value: 1,
      },
    })

    expect(result).toEqual({
      success: false,
      result: false,
    })
  })
})

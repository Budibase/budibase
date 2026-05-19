import {
  AutomationActionStepId,
  AutomationStatus,
  AutomationStepResult,
  AutomationStepStatus,
  FilterCondition,
  LoopStepType,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

const getLoopItems = (
  loopOutput: Record<string, unknown>
): Record<string, AutomationStepResult[]> => {
  return (loopOutput.items || {}) as Record<string, AutomationStepResult[]>
}

describe("Looping automations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("runs multiple loop v2 children for every item", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loopV2({
        steps: builder => {
          builder
            .serverLog({ text: "First child {{ loop.currentItem }}" })
            .serverLog({ text: "Second child {{ loop.currentItem }}" })
        },
        option: LoopStepType.ARRAY,
        binding: [1, 2, 3],
      })
      .serverLog({ text: "Processed {{ steps.1.iterations }} items" })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      success: true,
      iterations: 3,
      summary: {
        totalProcessed: 6,
        successCount: 6,
        failureCount: 0,
      },
    })

    const loopItems = getLoopItems(results.steps[0].outputs)
    const [firstChildResults, secondChildResults] = Object.values(loopItems)

    expect(firstChildResults).toHaveLength(3)
    expect(secondChildResults).toHaveLength(3)
    expect(firstChildResults[0].outputs.message).toContain("First child 1")
    expect(secondChildResults[2].outputs.message).toContain("Second child 3")
    expect(results.steps[1].outputs.message).toContain("Processed 3 items")
  })

  it("preserves separate context for each loop v2 iteration", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loopV2({
        steps: builder => {
          builder
            .executeScript({
              // eslint-disable-next-line no-template-curly-in-string
              code: "return `Prefix-${loop.currentItem}`",
            })
            .serverLog({ text: "{{ steps.1.value }}" })
        },
        option: LoopStepType.ARRAY,
        binding: ["A", "B", "C"],
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.summary.totalProcessed).toBe(6)

    const loopItems = getLoopItems(results.steps[0].outputs)
    const [, logResults] = Object.values(loopItems)

    expect(logResults[0].outputs.message).toContain("Prefix-A")
    expect(logResults[1].outputs.message).toContain("Prefix-B")
    expect(logResults[2].outputs.message).toContain("Prefix-C")
  })

  it("stops loop v2 at max iterations", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loopV2({
        steps: builder => {
          builder.serverLog({ text: "Item {{ loop.currentItem }}" })
        },
        option: LoopStepType.ARRAY,
        binding: [1, 2, 3, 4],
        iterations: 2,
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      success: false,
      iterations: 2,
      status: AutomationStepStatus.MAX_ITERATIONS,
      summary: {
        totalProcessed: 2,
      },
    })

    const loopItems = getLoopItems(results.steps[0].outputs)
    const [logResults] = Object.values(loopItems)

    expect(logResults).toHaveLength(2)
    expect(logResults[0].outputs.message).toContain("Item 1")
    expect(logResults[1].outputs.message).toContain("Item 2")
  })

  it("stops loop v2 at the failure condition", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loopV2({
        steps: builder => {
          builder.serverLog({ text: "Item {{ loop.currentItem }}" })
        },
        option: LoopStepType.ARRAY,
        binding: ["first", "stop", "third"],
        failure: "stop",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      success: false,
      iterations: 1,
      status: AutomationStepStatus.FAILURE_CONDITION,
      summary: {
        totalProcessed: 1,
        failureCount: 0,
      },
    })

    const loopItems = getLoopItems(results.steps[0].outputs)
    const [logResults] = Object.values(loopItems)

    expect(logResults).toHaveLength(1)
    expect(logResults[0].outputs.message).toContain("Item first")
  })

  it("stops loop v2 child execution when an iteration is stopped by a filter", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loopV2({
        steps: builder => {
          builder
            .filter({
              condition: FilterCondition.NOT_EQUAL,
              field: "{{ loop.currentItem }}",
              value: "skip",
            })
            .serverLog({ text: "Processed {{ loop.currentItem }}" })
        },
        option: LoopStepType.ARRAY,
        binding: ["process", "skip", "process"],
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.summary).toMatchObject({
      totalProcessed: 5,
      successCount: 5,
      failureCount: 0,
    })

    const loopItems = getLoopItems(results.steps[0].outputs)
    const [filterResults, logResults] = Object.values(loopItems)

    expect(filterResults[0].outputs.result).toBe(true)
    expect(filterResults[1].outputs).toMatchObject({
      result: false,
      status: AutomationStatus.STOPPED,
    })
    expect(filterResults).toHaveLength(3)
    expect(logResults).toHaveLength(2)
    expect(logResults[0].outputs.message).toContain("Processed process")
    expect(logResults[1].outputs.message).toContain("Processed process")
  })

  it("stores branch child results inside loop v2 items", async () => {
    const branchALogId = "11111111-1111-1111-1111-111111111111"
    const branchBLogId = "22222222-2222-2222-2222-222222222222"
    const afterBranchLogId = "33333333-3333-3333-3333-333333333333"

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loopV2({
        steps: builder => {
          builder
            .branch({
              takeA: {
                steps: b =>
                  b.serverLog(
                    { text: "Branch A {{ loop.currentItem }}" },
                    { stepId: branchALogId }
                  ),
                condition: {
                  equal: { "{{ literal loop.currentItem }}": 1 },
                },
              },
              takeB: {
                steps: b =>
                  b.serverLog(
                    { text: "Branch B {{ loop.currentItem }}" },
                    { stepId: branchBLogId }
                  ),
                condition: {
                  notEqual: { "{{ literal loop.currentItem }}": 1 },
                },
              },
            })
            .serverLog(
              { text: "After branch {{ loop.currentItem }}" },
              { stepId: afterBranchLogId }
            )
        },
        option: LoopStepType.ARRAY,
        binding: [1, 2],
      })
      .test({ fields: {} })

    const loopItems = getLoopItems(results.steps[0].outputs)
    const branchStepId = Object.keys(loopItems).find(
      stepId => loopItems[stepId][0]?.stepId === AutomationActionStepId.BRANCH
    )

    expect(branchStepId).toBeDefined()
    expect(loopItems[branchStepId!][0].inputs).toEqual({})
    expect(loopItems[branchALogId]).toHaveLength(1)
    expect(loopItems[branchALogId][0].outputs.message).toContain("Branch A 1")
    expect(loopItems[branchBLogId]).toHaveLength(1)
    expect(loopItems[branchBLogId][0].outputs.message).toContain("Branch B 2")
    expect(loopItems[afterBranchLogId]).toHaveLength(2)
  })

  it("supports nested loop v2 execution", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loopV2({
        steps: outerBuilder => {
          outerBuilder
            .serverLog({ text: "Outer {{ loop.currentItem.name }}" })
            .loopV2({
              steps: innerBuilder => {
                innerBuilder.serverLog({
                  text: "Inner {{ loop.currentItem }}",
                })
              },
              option: LoopStepType.ARRAY,
              binding: "{{ loop.currentItem.values }}",
            })
        },
        option: LoopStepType.ARRAY,
        binding: [
          { name: "Group A", values: ["A1", "A2", "A3"] },
          { name: "Group B", values: ["B1", "B2"] },
        ],
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toMatchObject({
      success: true,
      iterations: 2,
      summary: {
        totalProcessed: 4,
      },
    })
    expect(results.steps[0].outputs.nestedSummaries).toBeDefined()

    const loopItems = getLoopItems(results.steps[0].outputs)
    const [outerLogs, innerLoops] = Object.values(loopItems)

    expect(outerLogs[0].outputs.message).toContain("Outer Group A")
    expect(outerLogs[1].outputs.message).toContain("Outer Group B")
    expect(innerLoops[0].outputs.summary.totalProcessed).toBe(3)
    expect(innerLoops[1].outputs.summary.totalProcessed).toBe(2)
  })

  it("supports legacy loops followed by loop v2", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loop({
        option: LoopStepType.ARRAY,
        binding: [1, 2],
      })
      .serverLog({ text: "Legacy {{ loop.currentItem }}" })
      .loopV2({
        steps: builder => {
          builder
            .serverLog({ text: "Loop v2 {{ loop.currentItem }}" })
            .serverLog({ text: "Loop v2 second {{ loop.currentItem }}" })
        },
        option: LoopStepType.ARRAY,
        binding: ["A", "B"],
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.iterations).toBe(2)
    expect(results.steps[0].outputs.items).toHaveLength(2)
    expect(results.steps[0].outputs.items[0].message).toContain("Legacy 1")
    expect(results.steps[1].outputs.iterations).toBe(2)
    expect(results.steps[1].outputs.summary.totalProcessed).toBe(4)

    const loopV2Items = getLoopItems(results.steps[1].outputs)
    const [firstChild, secondChild] = Object.values(loopV2Items)

    expect(firstChild[0].outputs.message).toContain("Loop v2 A")
    expect(secondChild[0].outputs.message).toContain("Loop v2 second A")
  })
})

import { AutomationStepResult, LoopStepType, Table } from "@budibase/types"
import * as automation from "../../index"
import { basicTable } from "../../../tests/utilities/structures"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { result } from "lodash"

describe("New Loop step v2", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()
    table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, {})
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("should create a basic loop v2 step with multiple children", async () => {
    const binding = [1, 2, 3]
    const { steps } = await createAutomationBuilder(config)
      .onAppAction()
      .loopV2({
        steps: builder => {
          return [
            builder.serverLog({
              text: "Log Step 1 processing item: {{loop.currentItem}}",
            }),
            builder.serverLog({
              text: "Log Step 2 processing item: {{loop.currentItem}}",
            }),
          ]
        },
        option: LoopStepType.ARRAY,
        binding,
      })
      .serverLog({ text: "Hello" })
      .test({ fields: {} })

    let results: Record<string, AutomationStepResult[]> = steps[0].outputs.items

    Object.values(results).forEach((results, stepIndex) => {
      results.forEach((result, i) => {
        expect(result.outputs.message).toContain(
          `Log Step ${stepIndex + 1} processing item: ${i + 1}`
        )
      })
    })
  })
})

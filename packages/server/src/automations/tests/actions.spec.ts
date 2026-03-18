import { quotas } from "@budibase/pro"
import { FieldType, TableSourceType } from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import * as automation from "../index"
import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    quotas: {
      ...actual.quotas,
      addAction: jest.fn().mockImplementation((fn: () => Promise<any>) => fn()),
    },
  }
})

describe("Actions tracking", () => {
  const config = new TestConfiguration()
  const addActionMock = quotas.addAction as jest.MockedFunction<
    typeof quotas.addAction
  >

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await automation.init()
    addActionMock.mockClear()
  })

  afterAll(() => {
    config.end()
  })

  describe("BRANCH step tracking", () => {
    it("counts a BRANCH evaluation as one operation on top of its child steps", async () => {
      await createAutomationBuilder(config)
        .onAppAction()
        .branch({
          taken: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "branch taken" }),
            condition: { equal: { "1": "1" } },
          },
        })
        .test({ fields: {} })

      // 1 for trigger (externalTrigger) + 1 for BRANCH + 1 for the serverLog child step
      expect(addActionMock).toHaveBeenCalledTimes(3)
    })

    it("still counts child steps inside a taken branch", async () => {
      await createAutomationBuilder(config)
        .onAppAction()
        .branch({
          taken: {
            steps: stepBuilder =>
              stepBuilder
                .serverLog({ text: "step 1" })
                .serverLog({ text: "step 2" }),
            condition: { equal: { "1": "1" } },
          },
        })
        .test({ fields: {} })

      // 1 for trigger + 1 for BRANCH + 2 for the child steps
      expect(addActionMock).toHaveBeenCalledTimes(4)
    })
  })

  describe("Trigger execution tracking", () => {
    it("counts trigger execution as one operation", async () => {
      await createAutomationBuilder(config)
        .onAppAction()
        .serverLog({ text: "step" })
        .test({ fields: {} })

      // 1 for trigger + 1 for the server log step
      expect(addActionMock).toHaveBeenCalledTimes(2)
    })

    it("does not count trigger when externalTrigger filter conditions are not met", async () => {
      const table = await config.api.table.save({
        name: "test",
        type: "table",
        schema: {
          name: { name: "name", type: FieldType.STRING },
        },
        sourceId: "SOURCE_ID",
        sourceType: TableSourceType.INTERNAL,
      })

      const { externalTrigger } = await import("../triggers")

      const runner = await createAutomationBuilder(config)
        .onRowSaved({
          tableId: table._id!,
          filters: { equal: { name: "specific-name" } } as any,
        })
        .serverLog({ text: "step" })
        .save()

      await config.doInContext(undefined, () =>
        externalTrigger(
          runner.automation,
          { row: { name: "other-name" } } as any,
          { getResponses: true }
        )
      )

      // No addAction calls because the trigger filter was not met
      expect(addActionMock).not.toHaveBeenCalled()
    })
  })
})

import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Trigger context automations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await automation.init()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("passes user context through row triggers", async () => {
    const table = await config.api.table.save(basicTable())

    const results = await createAutomationBuilder(config)
      .onRowUpdated({ tableId: table._id! })
      .serverLog({ text: "{{ [user].[email] }}" })
      .test({
        row: { name: "Test", description: "TEST" },
        id: "1234",
      })

    expect(results.steps[0].outputs.message).toContain("example.com")
  })

  it("passes user context through app triggers", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "{{ [user].[email] }}" })
      .test({ fields: {} })

    expect(results.steps[0].outputs.message).toContain("example.com")
  })
})

import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Step binding automations", () => {
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

  it("fetches and deletes a row using named step bindings", async () => {
    const table = await config.api.table.save(basicTable())
    const row = {
      name: "DFN",
      description: "original description",
    }
    await config.api.row.save(table._id!, row)
    await config.api.row.save(table._id!, row)

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .queryRows(
        {
          tableId: table._id!,
        },
        { stepName: "InitialQueryStep" }
      )
      .deleteRow({
        tableId: table._id!,
        id: "{{ steps.InitialQueryStep.rows.0._id }}",
      })
      .queryRows({
        tableId: table._id!,
      })
      .test({ fields: {} })

    expect(results.steps).toHaveLength(3)
    expect(results.steps[1].outputs.success).toBeTruthy()
    expect(results.steps[2].outputs.rows).toHaveLength(1)
  })
})

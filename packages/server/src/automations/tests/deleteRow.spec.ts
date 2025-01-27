import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import * as setup from "./utilities"

describe("test the delete row action", () => {
  let table: any,
    row: any,
    config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
    table = await config.createTable()
    row = await config.createRow()
  })

  afterAll(setup.afterAll)

  it("should be able to run the delete row action", async () => {
    const builder = createAutomationBuilder({
      name: "Delete Row Automation",
    })

    await builder
      .appAction({ fields: {} })
      .deleteRow({
        tableId: table._id,
        id: row._id,
        revision: row._rev,
      })
      .run()

    await config.api.row.get(table._id, row._id, {
      status: 404,
    })
  })

  it("should check invalid inputs return an error", async () => {
    const builder = createAutomationBuilder({
      name: "Invalid Inputs Automation",
    })

    const results = await builder
      .appAction({ fields: {} })
      .deleteRow({ tableId: "", id: "", revision: "" })
      .run()

    expect(results.steps[0].outputs.success).toEqual(false)
  })

  it("should return an error when table doesn't exist", async () => {
    const builder = createAutomationBuilder({
      name: "Nonexistent Table Automation",
    })

    const results = await builder
      .appAction({ fields: {} })
      .deleteRow({
        tableId: "invalid",
        id: "invalid",
        revision: "invalid",
      })
      .run()

    expect(results.steps[0].outputs.success).toEqual(false)
  })
})

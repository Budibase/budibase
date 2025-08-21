import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { Row, Table } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

describe("test the delete row action", () => {
  const config = new TestConfiguration()

  let table: Table
  let row: Row

  beforeAll(async () => {
    await config.init()
    table = await config.api.table.save(basicTable())
    row = await config.api.row.save(table._id!, {})
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to run the delete row action", async () => {
    await createAutomationBuilder(config)
      .onAppAction()
      .deleteRow({
        tableId: table._id!,
        id: row._id!,
        revision: row._rev,
      })
      .test({ fields: {} })

    await config.api.row.get(table._id!, row._id!, {
      status: 404,
    })
  })

  it("should check invalid inputs return an error", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .deleteRow({ tableId: "", id: "", revision: "" })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toEqual(false)
  })

  it("should return an error when table doesn't exist", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .deleteRow({
        tableId: "invalid",
        id: "invalid",
        revision: "invalid",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toEqual(false)
  })
})

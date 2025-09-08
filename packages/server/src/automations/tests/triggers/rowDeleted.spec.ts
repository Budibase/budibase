import { Automation, Table } from "@budibase/types"
import { basicTable } from "../../../tests/utilities/structures"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { captureAutomationResults } from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("row deleted trigger", () => {
  const config = new TestConfiguration()
  let table: Table
  let automation: Automation

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
    table = await config.api.table.save(basicTable())
    automation = await createAutomationBuilder(config)
      .onRowDeleted({ tableId: table._id! })
      .serverLog({
        text: "Row was deleted",
      })
      .save()
      .then(({ automation }) => automation)

    await config.api.workspace.publish()
  })

  afterAll(() => {
    config.end()
  })

  it("should trigger when a row is deleted", async () => {
    const jobs = await captureAutomationResults(automation, async () => {
      await config.withProdApp(async () => {
        const row = await config.api.row.save(table._id!, { name: "foo" })
        await config.api.row.delete(table._id!, { _id: row._id! })
      })
    })

    expect(jobs).toHaveLength(1)
    expect(jobs[0].data.event).toEqual(
      expect.objectContaining({
        tableId: table._id!,
        row: expect.objectContaining({ name: "foo" }),
      })
    )
  })

  it("should not trigger when a row is deleted in a different table", async () => {
    const otherTable = await config.api.table.save(basicTable())
    await config.api.workspace.publish()

    const jobs = await captureAutomationResults(automation, async () => {
      await config.withProdApp(async () => {
        const row = await config.api.row.save(otherTable._id!, { name: "bar" })
        await config.api.row.delete(otherTable._id!, { _id: row._id! })
      })
    })

    expect(jobs).toHaveLength(0)
  })
})

import { Automation, Table } from "@budibase/types"
import { basicTable } from "../../../tests/utilities/structures"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { captureAutomationResults } from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("row saved trigger", () => {
  const config = new TestConfiguration()
  let table: Table
  let automation: Automation

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
    table = await config.api.table.save(basicTable())
    automation = await createAutomationBuilder(config)
      .onRowSaved({ tableId: table._id! })
      .serverLog({ text: "Row created!" })
      .save()
      .then(({ automation }) => automation)

    await config.api.workspace.publish()
  })

  afterAll(() => {
    config.end()
  })

  it("should queue a Bull job when a row is created", async () => {
    const results = await captureAutomationResults(automation, () =>
      config.withProdApp(() => config.api.row.save(table._id!, { name: "foo" }))
    )

    expect(results).toHaveLength(1)
    expect(results[0].data.event).toEqual(
      expect.objectContaining({
        tableId: table._id!,
        row: expect.objectContaining({ name: "foo" }),
      })
    )
  })

  it("should not fire for rows created in other tables", async () => {
    const otherTable = await config.api.table.save(basicTable())
    await config.api.workspace.publish()

    const results = await captureAutomationResults(automation, () =>
      config.withProdApp(() =>
        config.api.row.save(otherTable._id!, { name: "foo" })
      )
    )

    expect(results).toBeEmpty()
  })
})

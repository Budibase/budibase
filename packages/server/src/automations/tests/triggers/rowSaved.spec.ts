import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { Table } from "@budibase/types"
import { basicTable } from "../../../tests/utilities/structures"
import { captureAutomationRuns } from "../utilities"

describe("row saved trigger", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await config.init()
    table = await config.api.table.save(basicTable())
    await createAutomationBuilder(config)
      .onRowSaved({ tableId: table._id! })
      .serverLog({ text: "Row created!" })
      .save()

    await config.api.application.publish()
  })

  afterAll(() => {
    config.end()
  })

  it("should queue a Bull job when a row is created", async () => {
    const jobs = await captureAutomationRuns(() =>
      config.withProdApp(() => config.api.row.save(table._id!, { name: "foo" }))
    )

    expect(jobs).toHaveLength(1)
    expect(jobs[0].data.event).toEqual(
      expect.objectContaining({
        tableId: table._id!,
        row: expect.objectContaining({ name: "foo" }),
      })
    )
  })

  it("should not fire for rows created in other tables", async () => {
    const otherTable = await config.api.table.save(basicTable())
    await config.api.application.publish()

    const jobs = await captureAutomationRuns(() =>
      config.withProdApp(() =>
        config.api.row.save(otherTable._id!, { name: "foo" })
      )
    )

    expect(jobs).toBeEmpty()
  })
})

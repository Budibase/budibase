import { AutomationActionStepId } from "@budibase/types"
import TestConfiguration from "../../../src/tests/utilities/TestConfiguration"
import { runStep } from "./utilities"

describe("test the delete row action", () => {
  let table: any
  let row: any
  let inputs: any
  let config: TestConfiguration

  beforeEach(async () => {
    config = new TestConfiguration()
    await config.init()
    table = await config.createTable()
    row = await config.createRow()
    inputs = {
      tableId: table._id,
      id: row._id,
      revision: row._rev,
    }
  })

  afterEach(() => {
    config.end()
  })

  it("should be able to run the action", async () => {
    const res = await runStep(config, AutomationActionStepId.DELETE_ROW, inputs)
    expect(res).toEqual(
      expect.objectContaining({
        success: true,
        response: expect.any(Object),
        row: expect.objectContaining({
          _id: row._id,
        }),
      })
    )

    await config.api.row.get(table._id, res.row._id, {
      status: 404,
    })
  })

  it("check usage quota attempts", async () => {
    await config.withEnv({ NODE_ENV: "production" }, async () => {
      await runStep(config, AutomationActionStepId.DELETE_ROW, inputs)
    })
  })

  it("should check invalid inputs return an error", async () => {
    const res = await runStep(config, AutomationActionStepId.DELETE_ROW, {})
    expect(res).toEqual(expect.objectContaining({ success: false }))
  })

  it("should return an error when table doesn't exist", async () => {
    const res = await runStep(config, AutomationActionStepId.DELETE_ROW, {
      tableId: "invalid",
      id: "invalid",
      revision: "invalid",
    })
    expect(res).toEqual(expect.objectContaining({ success: false }))
  })
})

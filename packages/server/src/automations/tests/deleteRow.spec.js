const usageQuota = require("../../utilities/usageQuota")
const env = require("../../environment")
const setup = require("./utilities")

jest.mock("../../utilities/usageQuota")

describe("test the delete row action", () => {
  let table, row, inputs
  let config = setup.getConfig()

  beforeEach(async () => {
    await config.init()
    table = await config.createTable()
    row = await config.createRow()
    inputs = {
      tableId: table._id,
      id: row._id,
      revision: row._rev,
    }
  })

  afterAll(setup.afterAll)

  it("should be able to run the action", async () => {
    const res = await setup.runStep(setup.actions.DELETE_ROW.stepId, inputs)
    expect(res.success).toEqual(true)
    expect(res.response).toBeDefined()
    expect(res.row._id).toEqual(row._id)
    let error
    try {
      await config.getRow(table._id, res.id)
    } catch (err) {
      error = err
    }
    expect(error).toBeDefined()
  })

  it("check usage quota attempts", async () => {
    env.CLOUD = true
    await setup.runStep(setup.actions.DELETE_ROW.stepId, inputs)
    expect(usageQuota.update).toHaveBeenCalledWith(setup.apiKey, "rows", -1)
    env.CLOUD = false
  })

  it("should check invalid inputs return an error", async () => {
    const res = await setup.runStep(setup.actions.DELETE_ROW.stepId, {})
    expect(res.success).toEqual(false)
  })

  it("should return an error when table doesn't exist", async () => {
    const res = await setup.runStep(setup.actions.DELETE_ROW.stepId, {
      tableId: "invalid",
      id: "invalid",
      revision: "invalid",
    })
    expect(res.success).toEqual(false)
  })
})

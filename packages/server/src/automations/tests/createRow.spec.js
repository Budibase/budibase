jest.mock("../../utilities/usageQuota")

const usageQuota = require("../../utilities/usageQuota")
const setup = require("./utilities")

describe("test the create row action", () => {
  let table, row
  let config = setup.getConfig()

  beforeEach(async () => {
    await config.init()
    table = await config.createTable()
    row = {
      tableId: table._id,
      name: "test",
      description: "test",
    }
  })

  afterAll(setup.afterAll)

  it("should be able to run the action", async () => {
    const res = await setup.runStep(setup.actions.CREATE_ROW.stepId, {
      row,
    })
    expect(res.id).toBeDefined()
    expect(res.revision).toBeDefined()
    expect(res.success).toEqual(true)
    const gottenRow = await config.getRow(table._id, res.id)
    expect(gottenRow.name).toEqual("test")
    expect(gottenRow.description).toEqual("test")
  })

  it("should return an error (not throw) when bad info provided", async () => {
    const res = await setup.runStep(setup.actions.CREATE_ROW.stepId, {
      row: {
        tableId: "invalid",
        invalid: "invalid",
      }
    })
    expect(res.success).toEqual(false)
  })

  it("check usage quota attempts", async () => {
    await setup.runInProd(async () => {
      await setup.runStep(setup.actions.CREATE_ROW.stepId, {
        row
      })
      expect(usageQuota.update).toHaveBeenCalledWith("rows", 1)
    })
  })

  it("should check invalid inputs return an error", async () => {
    const res = await setup.runStep(setup.actions.CREATE_ROW.stepId, {})
    expect(res.success).toEqual(false)
  })
})

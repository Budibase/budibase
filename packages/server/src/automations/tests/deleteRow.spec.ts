const setup = require("./utilities")

describe("test the delete row action", () => {
  let table: any
  let row: any
  let inputs: any
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
      await config.getRow(table._id, res.row._id)
    } catch (err) {
      error = err
    }
    expect(error).toBeDefined()
  })

  it("check usage quota attempts", async () => {
    await setup.runInProd(async () => {
      await setup.runStep(setup.actions.DELETE_ROW.stepId, inputs)
    })
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

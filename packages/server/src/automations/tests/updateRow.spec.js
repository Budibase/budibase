const setup = require("./utilities")

describe("test the update row action", () => {
  let table, row, inputs
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
    table = await config.createTable()
    row = await config.createRow()
    inputs = {
      rowId: row._id,
      row: {
        ...row,
        name: "Updated name",
        // put a falsy option in to be removed
        description: "",
      }
    }
  })

  afterAll(setup.afterAll)

  it("should be able to run the action", async () => {
    const res = await setup.runStep(setup.actions.UPDATE_ROW.stepId, inputs)
    expect(res.success).toEqual(true)
    const updatedRow = await config.getRow(table._id, res.id)
    expect(updatedRow.name).toEqual("Updated name")
    expect(updatedRow.description).not.toEqual("")
  })

  it("should check invalid inputs return an error", async () => {
    const res = await setup.runStep(setup.actions.UPDATE_ROW.stepId, {})
    expect(res.success).toEqual(false)
  })

  it("should return an error when table doesn't exist", async () => {
    const res = await setup.runStep(setup.actions.UPDATE_ROW.stepId, {
      row: { _id: "invalid" },
      rowId: "invalid",
    })
    expect(res.success).toEqual(false)
  })
})

// lucene searching not supported in test due to use of PouchDB
let rows = []
jest.mock("../../api/controllers/row/internalSearch", () => ({
  fullSearch: jest.fn(() => {
    return {
      rows,
    }
  }),
  paginatedSearch: jest.fn(),
}))
const setup = require("./utilities")

const NAME = "Test"

describe("Test a query step automation", () => {
  let table
  let config = setup.getConfig()

  beforeEach(async () => {
    await config.init()
    table = await config.createTable()
    const row = {
      name: NAME,
      description: "original description",
      tableId: table._id,
    }
    rows.push(await config.createRow(row))
    rows.push(await config.createRow(row))
  })

  afterAll(setup.afterAll)

  it("should be able to run the query step", async () => {
    const inputs = {
      tableId: table._id,
      filters: {
        equal: {
          name: NAME,
        },
      },
      sortColumn: "name",
      sortOrder: "ascending",
      limit: 10,
    }
    const res = await setup.runStep(setup.actions.QUERY_ROWS.stepId, inputs)
    expect(res.success).toBe(true)
    expect(res.rows).toBeDefined()
    expect(res.rows.length).toBe(2)
    expect(res.rows[0].name).toBe(NAME)
  })
})

// lucene searching not supported in test due to use of PouchDB
let rows: Row[] = []
jest.mock("../../sdk/app/rows/search/internalSearch", () => ({
  fullSearch: jest.fn(() => {
    return {
      rows,
    }
  }),
  paginatedSearch: jest.fn(),
}))
import { Row, Table } from "@budibase/types"
import * as setup from "./utilities"

const NAME = "Test"

describe("Test a query step automation", () => {
  let table: Table
  let config = setup.getConfig()

  beforeAll(async () => {
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

  it("Returns all rows when onEmptyFilter has no value and no filters are passed", async () => {
    const inputs = {
      tableId: table._id,
      filters: {},
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

  it("Returns no rows when onEmptyFilter is RETURN_NONE and theres no filters", async () => {
    const inputs = {
      tableId: table._id,
      filters: {},
      "filters-def": [],
      sortColumn: "name",
      sortOrder: "ascending",
      limit: 10,
      onEmptyFilter: "none",
    }
    const res = await setup.runStep(setup.actions.QUERY_ROWS.stepId, inputs)
    expect(res.success).toBe(false)
    expect(res.rows).toBeDefined()
    expect(res.rows.length).toBe(0)
  })

  it("Returns no rows when onEmptyFilters RETURN_NONE and a filter is passed with a null value", async () => {
    const inputs = {
      tableId: table._id,
      onEmptyFilter: "none",
      filters: {},
      "filters-def": [
        {
          value: null,
        },
      ],
      sortColumn: "name",
      sortOrder: "ascending",
      limit: 10,
    }
    const res = await setup.runStep(setup.actions.QUERY_ROWS.stepId, inputs)
    expect(res.success).toBe(false)
    expect(res.rows).toBeDefined()
    expect(res.rows.length).toBe(0)
  })

  it("Returns rows when onEmptyFilter is RETURN_ALL and no filter is passed", async () => {
    const inputs = {
      tableId: table._id,
      onEmptyFilter: "all",
      filters: {},
      sortColumn: "name",
      sortOrder: "ascending",
      limit: 10,
    }
    const res = await setup.runStep(setup.actions.QUERY_ROWS.stepId, inputs)
    expect(res.success).toBe(true)
    expect(res.rows).toBeDefined()
    expect(res.rows.length).toBe(2)
  })
})

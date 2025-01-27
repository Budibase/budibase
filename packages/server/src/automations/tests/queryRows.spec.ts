import { EmptyFilterOption, SortOrder, Table } from "@budibase/types"
import * as setup from "./utilities"
import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import * as automation from "../index"
import { basicTable } from "../../tests/utilities/structures"

const NAME = "Test"

describe("Test a query step automation", () => {
  let table: Table
  let config = setup.getConfig()

  beforeAll(async () => {
    await automation.init()
    await config.init()
    table = await config.createTable()

    const row = {
      name: NAME,
      description: "original description",
      tableId: table._id,
    }
    await config.createRow(row)
    await config.createRow(row)
  })

  afterAll(setup.afterAll)

  it("should be able to run the query step", async () => {
    const result = await createAutomationBuilder({
      name: "Basic Query Test",
      config,
    })
      .appAction({ fields: {} })
      .queryRows(
        {
          tableId: table._id!,
          filters: {
            equal: {
              name: NAME,
            },
          },
          sortColumn: "name",
          sortOrder: SortOrder.ASCENDING,
          limit: 10,
        },
        { stepName: "Query All Rows" }
      )
      .run()

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(2)
    expect(result.steps[0].outputs.rows[0].name).toBe(NAME)
  })

  it("Returns all rows when onEmptyFilter has no value and no filters are passed", async () => {
    const result = await createAutomationBuilder({
      name: "Empty Filter Test",
      config,
    })
      .appAction({ fields: {} })
      .queryRows(
        {
          tableId: table._id!,
          filters: {},
          sortColumn: "name",
          sortOrder: SortOrder.ASCENDING,
          limit: 10,
        },
        { stepName: "Query With Empty Filter" }
      )
      .run()

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(2)
    expect(result.steps[0].outputs.rows[0].name).toBe(NAME)
  })

  it("Returns no rows when onEmptyFilter is RETURN_NONE and theres no filters", async () => {
    const result = await createAutomationBuilder({
      name: "Return None Test",
      config,
    })
      .appAction({ fields: {} })
      .queryRows(
        {
          tableId: table._id!,
          filters: {},
          "filters-def": [],
          sortColumn: "name",
          sortOrder: SortOrder.ASCENDING,
          limit: 10,
          onEmptyFilter: EmptyFilterOption.RETURN_NONE,
        },
        { stepName: "Query With Return None" }
      )
      .run()

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(0)
  })

  it("Returns no rows when onEmptyFilters RETURN_NONE and a filter is passed with a null value", async () => {
    const result = await createAutomationBuilder({
      name: "Null Filter Test",
      config,
    })
      .appAction({ fields: {} })
      .queryRows(
        {
          tableId: table._id!,
          onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          filters: {},
          "filters-def": [
            {
              value: null,
            },
          ],
          sortColumn: "name",
          sortOrder: SortOrder.ASCENDING,
          limit: 10,
        },
        { stepName: "Query With Null Filter" }
      )
      .run()

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(0)
  })

  it("Returns rows when onEmptyFilter is RETURN_ALL and no filter is passed", async () => {
    const result = await createAutomationBuilder({
      name: "Return All Test",
      config,
    })
      .appAction({ fields: {} })
      .queryRows(
        {
          tableId: table._id!,
          onEmptyFilter: EmptyFilterOption.RETURN_ALL,
          filters: {},
          sortColumn: "name",
          sortOrder: SortOrder.ASCENDING,
          limit: 10,
        },
        { stepName: "Query With Return All" }
      )
      .run()

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(2)
  })

  it("return rows when querying a table with a space in the name", async () => {
    const tableWithSpaces = await config.createTable({
      ...basicTable(),
      name: "table with spaces",
    })
    await config.createRow({
      name: NAME,
      tableId: tableWithSpaces._id,
    })
    const result = await createAutomationBuilder({
      name: "Return All Test",
      config,
    })
      .appAction({ fields: {} })
      .queryRows(
        {
          tableId: tableWithSpaces._id!,
          onEmptyFilter: EmptyFilterOption.RETURN_ALL,
          filters: {},
        },
        { stepName: "Query table with spaces" }
      )
      .run()
    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(1)
  })
})

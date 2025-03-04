import { EmptyFilterOption, SortOrder, Table } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import * as automation from "../../index"
import { basicTable } from "../../../tests/utilities/structures"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

const NAME = "Test"

describe("Test a query step automation", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await automation.init()
    await config.init()
    table = await config.api.table.save(basicTable())

    const row = {
      name: NAME,
      description: "original description",
    }
    await config.api.row.save(table._id!, row)
    await config.api.row.save(table._id!, row)
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to run the query step", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
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
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(2)
    expect(result.steps[0].outputs.rows[0].name).toBe(NAME)
  })

  it("Returns all rows when onEmptyFilter has no value and no filters are passed", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
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
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(2)
    expect(result.steps[0].outputs.rows[0].name).toBe(NAME)
  })

  it("Returns no rows when onEmptyFilter is RETURN_NONE and theres no filters", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
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
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(0)
  })

  it("Returns no rows when onEmptyFilters RETURN_NONE and a filter is passed with a null value", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
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
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(0)
  })

  it("Returns rows when onEmptyFilter is RETURN_ALL and no filter is passed", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
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
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(2)
  })

  it("return rows when querying a table with a space in the name", async () => {
    const tableWithSpaces = await config.api.table.save({
      ...basicTable(),
      name: "table with spaces",
    })
    await config.api.row.save(tableWithSpaces._id!, {
      name: NAME,
    })
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .queryRows(
        {
          tableId: tableWithSpaces._id!,
          onEmptyFilter: EmptyFilterOption.RETURN_ALL,
          filters: {},
        },
        { stepName: "Query table with spaces" }
      )
      .test({ fields: {} })
    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.rows).toBeDefined()
    expect(result.steps[0].outputs.rows.length).toBe(1)
  })
})

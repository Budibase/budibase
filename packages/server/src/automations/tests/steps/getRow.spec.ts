import { EmptyFilterOption, SortOrder, Table } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import * as automation from "../../index"
import { basicTable } from "../../../tests/utilities/structures"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

const NAME = "Test"

describe("Get row automation step", () => {
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
    await config.api.row.save(table._id!, {
      name: `${NAME} 2`,
      description: "second description",
    })

    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("returns the first matching row when filters are provided", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .getRow(
        {
          tableId: table._id!,
          filters: {
            equal: {
              name: NAME,
            },
          },
          sortColumn: "name",
          sortOrder: SortOrder.ASCENDING,
        },
        { stepName: "Get row" }
      )
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.row).toBeDefined()
    expect(result.steps[0].outputs.row?.name).toBe(NAME)
  })

  it("returns null when onEmptyFilter is RETURN_NONE and filters are empty", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .getRow(
        {
          tableId: table._id!,
          onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          filters: {},
          "filters-def": [],
        },
        { stepName: "Get row with empty filters" }
      )
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.row).toBeNull()
  })

  it("returns the first row when onEmptyFilter is RETURN_ALL and filters are empty", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .getRow(
        {
          tableId: table._id!,
          onEmptyFilter: EmptyFilterOption.RETURN_ALL,
          filters: {},
          "filters-def": [],
          sortColumn: "name",
          sortOrder: SortOrder.ASCENDING,
        },
        { stepName: "Get row with empty filters, returning all" }
      )
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.row).toBeDefined()
    expect(result.steps[0].outputs.row?.name).toBe(NAME)
  })
})

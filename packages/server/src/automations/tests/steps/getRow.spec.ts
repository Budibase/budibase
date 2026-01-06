import { EmptyFilterOption, SortOrder, Table } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import * as automation from "../../index"
import { basicTable } from "../../../tests/utilities/structures"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

const NAME = "Test"

describe("Get row automation step", () => {
  const config = new TestConfiguration()
  let table: Table
  let rowId: string

  beforeAll(async () => {
    await automation.init()
    await config.init()
    table = await config.api.table.save(basicTable())

    const row = {
      name: NAME,
      description: "original description",
    }

    const savedRow = await config.api.row.save(table._id!, row)
    rowId = savedRow._id!
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

  it("returns null when rowId and filters are empty", async () => {
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

    expect(result.steps[0].outputs.success).toBe(false)
    expect(result.steps[0].outputs.row).toBeNull()
    expect(result.steps[0].outputs.response.message).toBe(
      "You must provide a matching row ID or at least one filter to get row."
    )
  })

  it("returns the row when rowId is provided even if filters don't match", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .getRow(
        {
          tableId: table._id!,
          rowId,
          filters: {
            equal: {
              name: "does not exist",
            },
          },
        },
        { stepName: "Get row by id" }
      )
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.row).toBeDefined()
    expect(result.steps[0].outputs.row?._id).toBe(rowId)
  })

  it("falls back to filters when rowId is not found and filters are set", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .getRow(
        {
          tableId: table._id!,
          rowId: "ro_missing_row_id",
          filters: {
            equal: {
              name: NAME,
            },
          },
          sortColumn: "name",
          sortOrder: SortOrder.ASCENDING,
        },
        { stepName: "Get row fallback" }
      )
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[0].outputs.row).toBeDefined()
    expect(result.steps[0].outputs.row?.name).toBe(NAME)
  })
})

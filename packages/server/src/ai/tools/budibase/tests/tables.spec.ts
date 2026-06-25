import { BasicOperator, ViewV2 } from "@budibase/types"
import { helpers } from "@budibase/shared-core"
import { BudibaseToolDefinition, getBudibaseTools } from ".."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { basicRow, basicTable } from "../../../../tests/utilities/structures"

type ToolInput<T extends BudibaseToolDefinition> = Parameters<
  NonNullable<T["tool"]["execute"]>
>[0]

describe("AI Tools - Tables", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  const getTableTool = () => {
    const tool = getBudibaseTools().find(tool => tool.name === "get_table")
    if (!tool?.tool.execute) {
      throw new Error("get_table tool not found")
    }
    return tool
  }

  const runGetTable = async (input: ToolInput<BudibaseToolDefinition>) => {
    const tool = getTableTool()
    return config.doInContext(undefined, async () => {
      const result = await tool.tool.execute!(input, {
        toolCallId: "test-tool-call",
        messages: [],
      })
      if (Symbol.asyncIterator in Object(result)) {
        throw new Error("Not expected")
      }
      return result as { table: { views?: Record<string, unknown> } }
    })
  }

  const getViewRowCount = (
    views: Record<string, unknown> | undefined,
    viewName: string
  ): number | undefined => {
    const view = views?.[viewName]
    if (!view || !helpers.views.isV2(view as ViewV2)) {
      throw new Error(`View ${viewName} not found on table`)
    }
    return (view as ViewV2 & { rowCount?: number }).rowCount
  }

  it("exposes the record count of each view to agents", async () => {
    const table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, basicRow(table._id!))
    await config.api.row.save(table._id!, basicRow(table._id!))
    await config.api.row.save(table._id!, basicRow(table._id!))

    const view = await config.api.viewV2.create({
      tableId: table._id!,
      name: "All rows",
    })

    const result = await runGetTable({ tableId: table._id! })

    expect(getViewRowCount(result.table.views, view.name)).toBe(3)
  })

  it("returns counts that match the view's filtered records", async () => {
    const table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Active",
    })
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Active",
    })
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Inactive",
    })

    const view = await config.api.viewV2.create({
      tableId: table._id!,
      name: "Active only",
      query: [
        {
          operator: BasicOperator.EQUAL,
          field: "name",
          value: "Active",
        },
      ],
    })

    const result = await runGetTable({ tableId: table._id! })
    const toolCount = getViewRowCount(result.table.views, view.name)

    const search = await config.api.viewV2.search(view.id, { countRows: true })

    expect(toolCount).toBe(2)
    expect(toolCount).toBe(search.totalRows)
  })

  it("returns 0 for a view with no matching records", async () => {
    const table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Active",
    })

    const view = await config.api.viewV2.create({
      tableId: table._id!,
      name: "Empty view",
      query: [
        {
          operator: BasicOperator.EQUAL,
          field: "name",
          value: "Nonexistent",
        },
      ],
    })

    const result = await runGetTable({ tableId: table._id! })

    expect(getViewRowCount(result.table.views, view.name)).toBe(0)
  })

  it("leaves existing get_table behaviour unchanged for tables without views", async () => {
    const table = await config.api.table.save(basicTable())

    const result = await runGetTable({ tableId: table._id! })

    expect(result.table).toMatchObject({
      _id: table._id,
      name: table.name,
      schema: table.schema,
    })
    expect(Object.keys(result.table.views ?? {})).toHaveLength(0)
  })
})

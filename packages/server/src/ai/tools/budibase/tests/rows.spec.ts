import { BudibaseToolDefinition, getBudibaseTools } from ".."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { basicRow, basicTable } from "../../../../tests/utilities/structures"

type ToolLike<T extends BudibaseToolDefinition> = T
type ToolInput<T extends BudibaseToolDefinition> = Parameters<
  NonNullable<T["tool"]["execute"]>
>[0]
type ToolOutput<T extends BudibaseToolDefinition> = ReturnType<
  NonNullable<T["tool"]["execute"]>
>
type ToolWithExecute<T extends BudibaseToolDefinition> = ToolLike<T> & {
  tool: T["tool"] & { execute: NonNullable<T["tool"]["execute"]> }
}
type NonIterable<T> = T extends AsyncIterable<any> ? never : T

describe("AI Tools - Rows", () => {
  const config = new TestConfiguration()

  const runInContext = async <T>(fn: () => Promise<T>): Promise<T> => {
    return config.doInContext(undefined, fn)
  }

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  async function executeTool<T extends BudibaseToolDefinition>(
    tool: ToolLike<T>,
    input: ToolInput<T>
  ) {
    function isAsyncIterable<T>(v: unknown): v is AsyncIterable<T> {
      return v != null && typeof (v as any)[Symbol.asyncIterator] === "function"
    }

    const ensureExecute = <T extends BudibaseToolDefinition>(
      tool: T | Omit<T, "name">
    ): ToolWithExecute<T> => {
      if (!tool.tool.execute) {
        throw new Error("execute for tool is not defined")
      }
      return tool as ToolWithExecute<T>
    }

    const executableTool = ensureExecute(tool)
    return runInContext(async () => {
      const result = (await executableTool.tool.execute(input, {
        toolCallId: "test-tool-call",
        messages: [],
      })) as ToolOutput<T>

      if (isAsyncIterable(result)) {
        throw new Error("Not expected")
      }

      return result as NonIterable<ToolOutput<T>>
    })
  }

  it("should update a row using full data and preserve unspecified fields", async () => {
    const table = await config.api.table.save(basicTable())
    const createdRow = await config.api.row.save(
      table._id!,
      basicRow(table._id!)
    )

    const tools = getBudibaseTools([table])
    console.debug(tools)
    const updateAlias = tools.find(
      tool => tool.name === `${table._id}_update_row`
    )

    if (!updateAlias) {
      throw new Error("Alias update tool not found")
    }

    const result = await executeTool(updateAlias, {
      rowId: createdRow._id!,
      rowRev: createdRow._rev!,
      data: {
        name: "Updated name",
      },
    })

    expect(result.row.name).toBe("Updated name")
    expect(result.row.description).toBe("original description")

    const persistedRow = await config.api.row.get(table._id!, createdRow._id!)

    expect(persistedRow.name).toBe("Updated name")
    expect(persistedRow.description).toBe("original description")
  })

  it("should create and update rows via table alias tools", async () => {
    const table = await config.api.table.save(basicTable())
    const tools = getBudibaseTools([table])

    const createAlias = tools.find(
      tool => tool.name === `${table._id}_create_row`
    )
    const updateAlias = tools.find(
      tool => tool.name === `${table._id}_update_row`
    )

    if (!createAlias || !updateAlias) {
      throw new Error("Alias tools not found")
    }

    const created = await executeTool(createAlias, {
      data: {
        name: "Alias row",
        description: "Alias description",
      },
    })

    const updated = await executeTool(updateAlias, {
      rowId: created.row._id,
      rowRev: created.row._rev,
      data: {
        name: "Alias row updated",
      },
    })

    expect(updated.row.name).toBe("Alias row updated")
    expect(updated.row.description).toBe("Alias description")
  })

  it("should list rows with pagination", async () => {
    const table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, basicRow(table._id!))
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Second row",
    })
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Third row",
    })

    const tools = getBudibaseTools([table])
    const listTool = tools.find(tool => tool.name === `${table._id}_list_rows`)

    if (!listTool) {
      throw new Error("list_rows tool not found")
    }

    const firstPage = await executeTool(listTool, { limit: 2 })

    expect(firstPage.rows).toHaveLength(2)
    expect(firstPage.hasNextPage).toBe(true)
    expect(firstPage.bookmark).toBeDefined()

    const secondPage = await executeTool(listTool, {
      limit: 2,
      bookmark: firstPage.bookmark,
    })

    expect(secondPage.rows).toHaveLength(1)
    expect(secondPage.hasNextPage).toBe(false)
  })

  it("should get a specific row by ID", async () => {
    const table = await config.api.table.save(basicTable())
    const createdRow = await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Test row",
      description: "Test description",
    })

    const tools = getBudibaseTools([table])
    const getTool = tools.find(tool => tool.name === `${table._id}_get_row`)

    if (!getTool) {
      throw new Error("get_row tool not found")
    }

    const result = await executeTool(getTool, { rowId: createdRow._id! })

    expect(result.row._id).toBe(createdRow._id)
    expect(result.row.name).toBe("Test row")
    expect(result.row.description).toBe("Test description")
  })

  it("should search rows with query filters", async () => {
    const table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Alice",
      description: "First person",
    })
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Bob",
      description: "Second person",
    })
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Alice",
      description: "Another Alice",
    })

    const tools = getBudibaseTools([table])
    const searchTool = tools.find(
      tool => tool.name === `${table._id}_search_rows`
    )

    if (!searchTool) {
      throw new Error("search_rows tool not found")
    }

    const result = await executeTool(searchTool, {
      query: { equal: { name: "Alice" } },
    })

    expect(result.rows).toHaveLength(2)
    expect(result.rows.every((row: any) => row.name === "Alice")).toBe(true)
  })

  it("should search rows with sort and limit", async () => {
    const table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Charlie",
    })
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Alice",
    })
    await config.api.row.save(table._id!, {
      ...basicRow(table._id!),
      name: "Bob",
    })

    const tools = getBudibaseTools([table])
    const searchTool = tools.find(
      tool => tool.name === `${table._id}_search_rows`
    )

    if (!searchTool) {
      throw new Error("search_rows tool not found")
    }

    const result = await executeTool(searchTool, {
      sort: { column: "name", order: "ascending" },
      limit: 2,
    })

    expect(result.rows).toHaveLength(2)
    expect(result.rows[0].name).toBe("Alice")
    expect(result.rows[1].name).toBe("Bob")
  })
})

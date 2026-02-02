import { BudibaseToolDefinition, getBudibaseTools } from ".."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { basicRow, basicTable } from "../../../../tests/utilities/structures"

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
    tool: T | Omit<T, "name">,
    input: Parameters<NonNullable<T["tool"]["execute"]>>[0]
  ) {
    function isAsyncIterable<T>(v: unknown): v is AsyncIterable<T> {
      return v != null && typeof (v as any)[Symbol.asyncIterator] === "function"
    }

    type ToolWithExecute<T extends BudibaseToolDefinition> =
      | (T & {
          tool: T["tool"] & {
            execute: NonNullable<T["tool"]["execute"]>
          }
        })
      | (Omit<T, "name"> & {
          tool: T["tool"] & {
            execute: NonNullable<T["tool"]["execute"]>
          }
        })

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
      })) as ReturnType<NonNullable<T["tool"]["execute"]>>

      if (isAsyncIterable(result)) {
        throw new Error("Not expected")
      }

      type NonIterable<T> = T extends AsyncIterable<any> ? never : T
      return result as NonIterable<
        ReturnType<NonNullable<T["tool"]["execute"]>>
      >
    })
  }

  it("should update a row using full data and preserve unspecified fields", async () => {
    const table = await config.api.table.save(basicTable())
    const createdRow = await config.api.row.save(
      table._id!,
      basicRow(table._id!)
    )

    const tools = getBudibaseTools([table])
    const updateAlias = tools.find(
      tool => tool.name === `${table._id}.update_row`
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
      tool => tool.name === `${table._id}.create_row`
    )
    const updateAlias = tools.find(
      tool => tool.name === `${table._id}.update_row`
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
})

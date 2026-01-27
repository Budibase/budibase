import { BudibaseToolDefinition } from ".."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { basicRow, basicTable } from "../../../../tests/utilities/structures"
import rowTools from "../rows"

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

  async function executeTool<T extends Omit<BudibaseToolDefinition, "name">>(
    tool: T,
    input: Parameters<NonNullable<T["tool"]["execute"]>>[0]
  ) {
    function isAsyncIterable<T>(v: unknown): v is AsyncIterable<T> {
      return v != null && typeof (v as any)[Symbol.asyncIterator] === "function"
    }

    type ToolWithExecute<T extends Omit<BudibaseToolDefinition, "name">> = T & {
      tool: T["tool"] & {
        execute: NonNullable<T["tool"]["execute"]>
      }
    }

    const ensureExecute = <T extends Omit<BudibaseToolDefinition, "name">>(
      tool: T
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

    const result = await executeTool(rowTools.update_row, {
      tableId: table._id!,
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
})

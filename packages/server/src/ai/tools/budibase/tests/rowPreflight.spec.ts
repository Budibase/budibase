import { FieldType, ToolAction, type Row } from "@budibase/types"
import sdk from "../../../../sdk"
import { basicTable } from "../../../../tests/utilities/structures"
import { toToolSet } from "../.."
import { createRowTools } from "../rows"

describe("row tool platform preflight", () => {
  const table = basicTable(undefined, {
    _id: "ta_test",
    primaryDisplay: "name",
    schema: {
      name: { name: "name", type: FieldType.STRING },
      Category: {
        name: "Category",
        type: FieldType.OPTIONS,
        constraints: {
          presence: { allowEmpty: false },
          inclusion: ["Food", "Other", ""],
        },
      },
      Time: { name: "Time", type: FieldType.DATETIME, timeOnly: true },
      Email: {
        name: "Email",
        type: FieldType.STRING,
        constraints: { email: true },
      },
      Notes: {
        name: "Notes",
        type: FieldType.STRING,
        constraints: { length: { maximum: 5 } },
      },
      Currency: {
        name: "Currency",
        type: FieldType.STRING,
        default: "EUR",
        constraints: { presence: true },
      },
    },
  })

  beforeEach(() => {
    jest.spyOn(sdk.tables, "getTable").mockResolvedValue(table)
    jest.spyOn(sdk.rows, "save").mockImplementation(() => {
      throw new Error("Preflight must not save a row")
    })
  })

  afterEach(() => jest.restoreAllMocks())

  const prepare = (action: ToolAction) => {
    const definition = createRowTools({
      tableId: table._id!,
      tableName: table.name,
      tableSchema: table.schema,
      tableSourceType: table.sourceType,
      primaryDisplay: table.primaryDisplay,
    }).find(tool => tool.action === action)!
    const intercept = jest.fn().mockResolvedValue({ pending: true })
    const tools = toToolSet(
      [definition],
      new Map(),
      new Map([[definition.name, { intercept }]])
    )
    const execute = (input: object) =>
      tools[definition.name].execute!(input, {
        toolCallId: "call_1",
        messages: [],
        context: undefined,
      })
    return { execute, intercept }
  }

  it.each([
    { name: "Lunch" },
    { Category: "Food" },
    { name: "Lunch", Category: "" },
    { name: "Lunch", Category: "Food", Time: "not-a-time" },
    { name: "Lunch", Category: "Food", Email: "invalid" },
    { name: "Lunch", Category: "Food", Notes: "Too long" },
  ])("rejects invalid rows before escalation: %j", async data => {
    const { execute, intercept } = prepare(ToolAction.CREATE_ROW)
    await expect(execute({ data })).rejects.toThrow("Invalid row")
    expect(intercept).not.toHaveBeenCalled()
    expect(sdk.rows.save).not.toHaveBeenCalled()
  })

  it("freezes defaults without mutating the proposed input", async () => {
    const { execute, intercept } = prepare(ToolAction.CREATE_ROW)
    const data = { name: "Lunch", Category: "Food", Time: "12:30" }
    await execute({ data })
    expect(intercept).toHaveBeenCalledWith(
      { data: { ...data, Currency: "EUR" } },
      expect.anything()
    )
    expect(data).toEqual({ name: "Lunch", Category: "Food", Time: "12:30" })
    expect(sdk.rows.save).not.toHaveBeenCalled()
  })

  it("revalidates against changed constraints before executing an approved payload", async () => {
    const { execute, intercept } = prepare(ToolAction.CREATE_ROW)
    const input = { data: { name: "Lunch", Category: "Food", Currency: "EUR" } }
    await execute(input)
    intercept.mockClear()
    jest.mocked(sdk.tables.getTable).mockResolvedValue({
      ...table,
      schema: {
        ...table.schema,
        name: {
          name: "name",
          type: FieldType.STRING,
          constraints: { length: { maximum: 2 } },
        },
      },
    })

    await expect(execute(input)).rejects.toThrow("Invalid row")
    expect(intercept).not.toHaveBeenCalled()
    expect(sdk.rows.save).not.toHaveBeenCalled()
  })

  it("validates updates against existing fields without resubmitting them", async () => {
    const existing: Row = {
      _id: "ro_test",
      _rev: "1-test",
      name: "Lunch",
      Category: "Food",
      Currency: "EUR",
    }
    jest.spyOn(sdk.rows, "find").mockResolvedValue(existing)
    const { execute, intercept } = prepare(ToolAction.UPDATE_ROW)
    const input = {
      rowId: "ro_test",
      rowRev: "1-test",
      data: { Notes: "Note" },
    }
    await execute(input)
    expect(intercept).toHaveBeenCalledWith(input, expect.anything())
    expect(existing).not.toHaveProperty("Notes")
    expect(sdk.rows.save).not.toHaveBeenCalled()
  })
})

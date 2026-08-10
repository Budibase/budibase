import { FieldType, RelationshipType } from "@budibase/types"
import sdk from "../../../../sdk"
import { basicTable } from "../../../../tests/utilities/structures"
import { createTableTools } from "../tables"

describe("AI Tools - Tables", () => {
  const invoices = basicTable(undefined, {
    _id: "ta_invoices",
    name: "Invoices",
    schema: {
      invoiceNumber: {
        name: "invoiceNumber",
        type: FieldType.STRING,
      },
      supplier: {
        name: "supplier",
        fieldName: "supplier",
        type: FieldType.LINK,
        tableId: "ta_suppliers",
        relationshipType: RelationshipType.MANY_TO_ONE,
      },
    },
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("lists only configured tables and removes relationship schemas", async () => {
    const getTables = jest
      .spyOn(sdk.tables, "getTables")
      .mockResolvedValue([invoices])
    const listTables = createTableTools(["ta_invoices", "ta_invoices"]).find(
      tool => tool.name === "list_tables"
    )
    if (!listTables?.tool.execute) {
      throw new Error("list_tables tool not found")
    }

    const result = await listTables.tool.execute(
      { showSchema: true },
      { toolCallId: "test-tool-call", messages: [] }
    )

    expect(getTables).toHaveBeenCalledWith(["ta_invoices"])
    expect(result).toEqual({
      tables: [
        expect.objectContaining({
          id: "ta_invoices",
          tableName: "Invoices",
          schema: expect.objectContaining({
            invoiceNumber: invoices.schema.invoiceNumber,
          }),
        }),
      ],
    })
    expect(result).not.toHaveProperty("tables.0.schema.supplier")
  })

  it("rejects table IDs outside the configured scope before fetching", async () => {
    const getTable = jest.spyOn(sdk.tables, "getTable")
    const getTableTool = createTableTools(["ta_invoices"]).find(
      tool => tool.name === "get_table"
    )
    if (!getTableTool?.tool.execute) {
      throw new Error("get_table tool not found")
    }

    await expect(
      getTableTool.tool.execute(
        { tableId: "ta_suppliers" },
        { toolCallId: "test-tool-call", messages: [] }
      )
    ).rejects.toThrow("Table is not configured for the current operation")
    expect(getTable).not.toHaveBeenCalled()
  })
})

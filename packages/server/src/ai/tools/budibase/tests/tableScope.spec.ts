import {
  FieldType,
  RelationshipType,
  TableSourceType,
  type TableSchema,
} from "@budibase/types"
import { basicTable } from "../../../../tests/utilities/structures"
import {
  getAgentTableFields,
  getAgentTableSchema,
  sanitizeAgentRow,
  sanitizeAgentTable,
} from "../tableScope"

const schema: TableSchema = {
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
  hidden: {
    name: "hidden",
    type: FieldType.STRING,
    visible: false,
  },
}

describe("agent table scope", () => {
  it("removes relationship fields from schemas, field lists, and rows", () => {
    expect(getAgentTableSchema(schema)).toEqual({
      invoiceNumber: schema.invoiceNumber,
      hidden: schema.hidden,
    })
    expect(getAgentTableFields(schema)).toEqual(["invoiceNumber"])
    expect(
      sanitizeAgentRow(
        {
          _id: "ro_invoice_1",
          invoiceNumber: "INV-001",
          supplier: [
            {
              _id: "supplier_1",
              primaryDisplay: "ACCOUNT-4100-UNEXPOSED",
            },
          ],
        },
        schema
      )
    ).toEqual({
      _id: "ro_invoice_1",
      invoiceNumber: "INV-001",
    })
  })

  it("does not expose a relationship primary display in table metadata", () => {
    const table = basicTable(undefined, {
      _id: "ta_invoices",
      name: "Invoices",
      sourceType: TableSourceType.INTERNAL,
      primaryDisplay: "supplier",
      schema,
    })

    const sanitized = sanitizeAgentTable(table)

    expect(sanitized).toEqual(
      expect.objectContaining({
        id: "ta_invoices",
        tableName: "Invoices",
        sourceType: TableSourceType.INTERNAL,
        primaryDisplay: undefined,
      })
    )
    expect(sanitized.schema).toEqual(
      expect.objectContaining({
        invoiceNumber: schema.invoiceNumber,
        hidden: schema.hidden,
      })
    )
    expect(sanitized.schema).not.toHaveProperty("supplier")
  })
})

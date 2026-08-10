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
  supplierAccount: {
    name: "supplierAccount",
    type: FieldType.FORMULA,
    formula: "{{ supplier.0.primaryDisplay }}",
  },
  hidden: {
    name: "hidden",
    type: FieldType.STRING,
    visible: false,
  },
}

describe("agent table scope", () => {
  it("removes relationship and formula fields from agent data", () => {
    expect(getAgentTableSchema(schema)).toEqual({
      invoiceNumber: schema.invoiceNumber,
      hidden: schema.hidden,
    })
    expect(getAgentTableFields(schema)).toEqual(["invoiceNumber", "hidden"])
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
          supplierAccount: "ACCOUNT-4100-UNEXPOSED",
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
      _rev: "1-test",
      name: "Invoices",
      sourceType: TableSourceType.INTERNAL,
      primaryDisplay: "supplier",
      schema,
    })

    const sanitized = sanitizeAgentTable(table)

    expect(sanitized).toEqual(
      expect.objectContaining({
        _id: "ta_invoices",
        _rev: "1-test",
        name: "Invoices",
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
    expect(sanitized.schema).not.toHaveProperty("supplierAccount")
  })
})

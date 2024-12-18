import {
  AIOperationEnum,
  FieldType,
  RelationshipType,
  SourceName,
  Table,
} from "@budibase/types"
import { buildSqlFieldList } from "../sqlUtils"
import { structures } from "../../../../routes/tests/utilities"
import { sql } from "@budibase/backend-core"

describe("buildSqlFieldList", () => {
  let table: Table & { _id: string }

  beforeEach(() => {
    table = {
    ...structures.tableForDatasource({
      type: "datasource",
      source: SourceName.POSTGRES,
    }),
    name: "table",
    _id: sql.utils.buildExternalTableId("ds_id", "table"),
    schema: {
      name: {
        name: "name",
        type: FieldType.STRING,
      },
      description: {
        name: "description",
        type: FieldType.STRING,
      },
      amount: {
        name: "amount",
        type: FieldType.NUMBER,
      },
    },
  }
  })

  describe("table", () => {
    it("extracts fields from table schema", async () => {
      const result = await buildSqlFieldList(table, {})
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
      ])
    })

    it("excludes hidden fields", async () => {
      table.schema.description.visible = false
      const result = await buildSqlFieldList(table, {})
      expect(result).toEqual(["table.name", "table.amount"])
    })

    it("excludes non-sql fields fields", async () => {
      table.schema.formula = {
        name: "formula",
        type: FieldType.FORMULA,
        formula: "any",
      }
      table.schema.ai = {
        name: "ai",
        type: FieldType.AI,
        operation: AIOperationEnum.PROMPT,
      }
      table.schema.link = {
        name: "link",
        type: FieldType.LINK,
        relationshipType: RelationshipType.ONE_TO_MANY,
        fieldName: "link",
        tableId: "otherTableId",
      }

      const result = await buildSqlFieldList(table, {})
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
      ])
    })

    it("includes hidden fields if there is a formula column", async () => {
      table.schema.description.visible = false
      table.schema.formula = {
        name: "formula",
        type: FieldType.FORMULA,
        formula: "any",
      }

      const result = await buildSqlFieldList(table, {})
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
      ])
    })

    it("includes relationships fields when flag", async () => {
      const otherTable: Table = {
        ...table,
        name: "linkedTable",
        primary: ["id"],
        primaryDisplay: "name",
        schema: {
          ...table.schema,
          id: {
            name: "id",
            type: FieldType.NUMBER,
          },
        },
      }

      table.schema.link = {
        name: "link",
        type: FieldType.LINK,
        relationshipType: RelationshipType.ONE_TO_MANY,
        fieldName: "link",
        tableId: sql.utils.buildExternalTableId("ds_id", "otherTableId"),
      }

      const allTables: Record<string, Table> = {
        otherTableId: otherTable,
      }

      const result = await buildSqlFieldList(table, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
        "linkedTable.id",
        "linkedTable.name",
      ])
    })

    it("includes all relationship fields if there is a formula column", async () => {
      const otherTable: Table = {
        ...table,
        name: "linkedTable",
        schema: {
          ...table.schema,
          id: {
            name: "id",
            type: FieldType.NUMBER,
          },
          hidden: {
            name: "other",
            type: FieldType.STRING,
            visible: false,
          },
          formula: {
            name: "formula",
            type: FieldType.FORMULA,
            formula: "any",
          },
          ai: {
            name: "ai",
            type: FieldType.AI,
            operation: AIOperationEnum.PROMPT,
          },
          link: {
            name: "link",
            type: FieldType.LINK,
            relationshipType: RelationshipType.ONE_TO_MANY,
            fieldName: "link",
            tableId: "otherTableId",
          },
        },
      }

      table.schema.link = {
        name: "link",
        type: FieldType.LINK,
        relationshipType: RelationshipType.ONE_TO_MANY,
        fieldName: "link",
        tableId: sql.utils.buildExternalTableId("ds_id", "otherTableId"),
      }
      table.schema.formula = {
        name: "formula",
        type: FieldType.FORMULA,
        formula: "any",
      }

      const allTables: Record<string, Table> = {
        otherTableId: otherTable,
      }

      const result = await buildSqlFieldList(table, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
        "linkedTable.name",
        "linkedTable.description",
        "linkedTable.amount",
        "linkedTable.id",
        "linkedTable.hidden",
      ])
    })

    it("never includes non-sql columns from relationships", async () => {
      const otherTable: Table = {
        ...table,
        name: "linkedTable",
        schema: {
          id: {
            name: "id",
            type: FieldType.NUMBER,
          },
          hidden: {
            name: "other",
            type: FieldType.STRING,
            visible: false,
          },
          formula: {
            name: "formula",
            type: FieldType.FORMULA,
            formula: "any",
          },
          ai: {
            name: "ai",
            type: FieldType.AI,
            operation: AIOperationEnum.PROMPT,
          },
          link: {
            name: "link",
            type: FieldType.LINK,
            relationshipType: RelationshipType.ONE_TO_MANY,
            fieldName: "link",
            tableId: "otherTableId",
          },
        },
      }

      table.schema.link = {
        name: "link",
        type: FieldType.LINK,
        relationshipType: RelationshipType.ONE_TO_MANY,
        fieldName: "link",
        tableId: sql.utils.buildExternalTableId("ds_id", "otherTableId"),
      }
      table.schema.formula = {
        name: "formula",
        type: FieldType.FORMULA,
        formula: "any",
      }

      const allTables: Record<string, Table> = {
        otherTableId: otherTable,
      }

      const result = await buildSqlFieldList(table, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
        "linkedTable.id",
        "linkedTable.hidden",
      ])
    })
  })
})

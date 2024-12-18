import {
  AIOperationEnum,
  FieldType,
  RelationshipType,
  SourceName,
  Table,
  ViewV2,
} from "@budibase/types"
import { buildSqlFieldList } from "../sqlUtils"
import { structures } from "../../../../routes/tests/utilities"
import { sql } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { generateViewID } from "../../../../../db/utils"

import sdk from "../../../../../sdk"

jest.mock("../../../../../sdk/app/views", () => ({
  ...jest.requireActual("../../../../../sdk/app/views"),
  getTable: jest.fn(),
}))
const getTableMock = sdk.views.getTable as jest.MockedFunction<
  typeof sdk.views.getTable
>

describe("buildSqlFieldList", () => {
  let table: Table & { _id: string }

  beforeEach(() => {
    jest.clearAllMocks()
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

    it("includes relationships fields when flagged", async () => {
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

  describe("view", () => {
    let view: ViewV2

    beforeEach(() => {
      getTableMock.mockResolvedValueOnce(table)

      view = {
        version: 2,
        id: generateViewID(table._id),
        name: generator.word(),
        tableId: table._id,
      }
    })

    it("extracts fields from table schema", async () => {
      view.schema = {
        name: { visible: false },
        amount: { visible: true },
      }

      const result = await buildSqlFieldList(view, {})
      expect(result).toEqual(["table.amount"])
    })

    it("includes all fields if there is a formula column", async () => {
      table.schema.formula = {
        name: "formula",
        type: FieldType.FORMULA,
        formula: "any",
      }

      view.schema = {
        name: { visible: false },
        amount: { visible: true },
        formula: { visible: true },
      }

      const result = await buildSqlFieldList(view, {})
      expect(result).toEqual([
        "table.name",
        "table.description",
        "table.amount",
      ])
    })

    it("does not includes all fields if the formula column is not included", async () => {
      table.schema.formula = {
        name: "formula",
        type: FieldType.FORMULA,
        formula: "any",
      }

      view.schema = {
        name: { visible: false },
        amount: { visible: true },
        formula: { visible: false },
      }

      const result = await buildSqlFieldList(view, {})
      expect(result).toEqual(["table.amount"])
    })

    it("includes relationships fields when flagged", async () => {
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

      view.schema = {
        name: { visible: true },
        link: { visible: true },
      }

      const allTables: Record<string, Table> = {
        otherTableId: otherTable,
      }

      const result = await buildSqlFieldList(view, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "linkedTable.id",
        "linkedTable.name",
      ])
    })

    it("includes relationships columns", async () => {
      const otherTable: Table = {
        ...table,
        name: "linkedTable",
        primary: ["id"],
        schema: {
          ...table.schema,
          id: {
            name: "id",
            type: FieldType.NUMBER,
          },
          formula: {
            name: "formula",
            type: FieldType.FORMULA,
            formula: "any",
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

      view.schema = {
        name: { visible: true },
        link: {
          visible: true,
          columns: {
            name: { visible: false },
            amount: { visible: true },
            formula: { visible: false },
          },
        },
      }

      const allTables: Record<string, Table> = {
        otherTableId: otherTable,
      }

      const result = await buildSqlFieldList(view, allTables, {
        relationships: true,
      })
      expect(result).toEqual([
        "table.name",
        "linkedTable.id",
        "linkedTable.amount",
      ])
    })

    it("does not include relationships columns for hidden links", async () => {
      const otherTable: Table = {
        ...table,
        name: "linkedTable",
        primary: ["id"],
        schema: {
          ...table.schema,
          id: {
            name: "id",
            type: FieldType.NUMBER,
          },
          formula: {
            name: "formula",
            type: FieldType.FORMULA,
            formula: "any",
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

      view.schema = {
        name: { visible: true },
        link: {
          visible: false,
          columns: {
            name: { visible: false },
            amount: { visible: true },
            formula: { visible: false },
          },
        },
      }

      const allTables: Record<string, Table> = {
        otherTableId: otherTable,
      }

      const result = await buildSqlFieldList(view, allTables, {
        relationships: true,
      })
      expect(result).toEqual(["table.name"])
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

      view.schema = {
        name: { visible: true },
        formula: { visible: true },
        link: {
          visible: false,
          columns: {
            name: { visible: false },
            amount: { visible: true },
            formula: { visible: false },
          },
        },
      }

      const allTables: Record<string, Table> = {
        otherTableId: otherTable,
      }

      const result = await buildSqlFieldList(view, allTables, {
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
  })
})

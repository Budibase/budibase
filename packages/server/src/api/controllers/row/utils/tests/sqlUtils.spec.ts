import {
  AIOperationEnum,
  FieldType,
  RelationshipType,
  Table,
} from "@budibase/types"
import { buildSqlFieldList } from "../sqlUtils"
import { structures } from "../../../../routes/tests/utilities"
import { cloneDeep } from "lodash"

describe("buildSqlFieldList", () => {
  const basicTable: Table = {
    ...structures.basicTable(),
    name: "table",
    schema: {
      name: {
        type: FieldType.STRING,
        name: "name",
      },
      description: {
        type: FieldType.STRING,
        name: "description",
      },
      amount: {
        type: FieldType.NUMBER,
        name: "amount",
      },
    },
  }

  it("extracts fields from table schema", async () => {
    const result = await buildSqlFieldList(basicTable, {})
    expect(result).toEqual(["table.name", "table.description", "table.amount"])
  })

  it("excludes hidden fields", async () => {
    const table = cloneDeep(basicTable)
    table.schema.description.visible = false
    const result = await buildSqlFieldList(table, {})
    expect(result).toEqual(["table.name", "table.amount"])
  })

  it("excludes non-sql fields fields", async () => {
    const table = cloneDeep(basicTable)
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
    expect(result).toEqual(["table.name", "table.description", "table.amount"])
  })

  it("includes hidden fields if there is a formula column", async () => {
    const table = cloneDeep(basicTable)
    table.schema.description.visible = false
    table.schema.formula = {
      name: "formula",
      type: FieldType.FORMULA,
      formula: "any",
    }

    const result = await buildSqlFieldList(table, {})
    expect(result).toEqual(["table.name", "table.description", "table.amount"])
  })
})

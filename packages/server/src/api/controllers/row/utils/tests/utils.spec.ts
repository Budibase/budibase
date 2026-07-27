import {
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  RelationshipsJson,
  RelationshipType,
  Table,
  TableSourceType,
} from "@budibase/types"
import { generateTableID } from "../../../../../db/utils"
import { processRelationshipFields } from "../utils"

describe("processRelationshipFields", () => {
  it("uses the linked table schema when processing linked row dates", async () => {
    const childTableId = generateTableID()

    const parentTable: Table = {
      type: "table",
      _id: generateTableID(),
      name: "parent",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        sharedDateField: {
          name: "sharedDateField",
          type: FieldType.DATETIME,
        },
        childRows: {
          name: "childRows",
          type: FieldType.LINK,
          tableId: childTableId,
          relationshipType: RelationshipType.ONE_TO_MANY,
          fieldName: "parent",
        },
      },
    }

    const childTable: Table = {
      type: "table",
      _id: childTableId,
      name: "child",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        sharedDateField: {
          name: "sharedDateField",
          type: FieldType.STRING,
        },
      },
    }

    const relationships: RelationshipsJson[] = [
      {
        tableName: childTable.name,
        column: "childRows",
      },
    ]

    const row = {
      childRows: [
        {
          sharedDateField: "12:15",
        },
      ],
    }

    const processedRow = await processRelationshipFields(
      parentTable,
      {
        [childTable.name]: childTable,
      },
      row,
      relationships
    )

    expect(processedRow.childRows[0].sharedDateField).toEqual("12:15")
  })
})

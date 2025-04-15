import {
  FieldSchema,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  InternalTable,
  RelationshipType,
  Row,
  Table,
  TableSourceType,
} from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

import * as uuid from "uuid"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("test the update row action", () => {
  const config = new TestConfiguration()

  let table: Table
  let row: Row

  beforeAll(async () => {
    await config.init()
    table = await config.createTable()
    row = await config.createRow()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to run the update row action", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .updateRow({
        rowId: row._id!,
        row: {
          ...row,
          name: "Updated name",
          description: "",
        },
        meta: {},
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toEqual(true)
    const updatedRow = await config.api.row.get(
      table._id!,
      results.steps[0].outputs.id
    )
    expect(updatedRow.name).toEqual("Updated name")
    expect(updatedRow.description).not.toEqual("")
  })

  it("should check invalid inputs return an error", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .updateRow({ meta: {}, row: {}, rowId: "" })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toEqual(false)
  })

  it("should return an error when table doesn't exist", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .updateRow({
        row: { _id: "invalid" },
        rowId: "invalid",
        meta: {},
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toEqual(false)
  })

  it("should not overwrite links if those links are not set", async () => {
    const linkField: FieldSchema = {
      type: FieldType.LINK,
      name: "",
      fieldName: "",
      constraints: {
        type: "array",
        presence: false,
      },
      relationshipType: RelationshipType.ONE_TO_MANY,
      tableId: InternalTable.USER_METADATA,
    }

    const table = await config.api.table.save({
      name: uuid.v4(),
      type: "table",
      sourceType: TableSourceType.INTERNAL,
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      schema: {
        user1: { ...linkField, name: "user1", fieldName: uuid.v4() },
        user2: { ...linkField, name: "user2", fieldName: uuid.v4() },
      },
    })

    const user1 = await config.createUser()
    const user2 = await config.createUser()

    const row = await config.api.row.save(table._id!, {
      user1: [{ _id: user1._id }],
      user2: [{ _id: user2._id }],
    })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .updateRow({
        rowId: row._id!,
        row: {
          _id: row._id,
          _rev: row._rev,
          tableId: row.tableId,
          user1: [user2._id],
          user2: "",
        },
        meta: {},
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toEqual(true)

    const getResp = await config.api.row.get(table._id!, row._id!)
    expect(getResp.user1[0]._id).toEqual(user2._id)
    expect(getResp.user2[0]._id).toEqual(user2._id)
  })

  it("should overwrite links if those links are not set and we ask it to", async () => {
    const linkField: FieldSchema = {
      type: FieldType.LINK,
      name: "",
      fieldName: "",
      constraints: {
        type: "array",
        presence: false,
      },
      relationshipType: RelationshipType.ONE_TO_MANY,
      tableId: InternalTable.USER_METADATA,
    }

    const table = await config.api.table.save({
      name: uuid.v4(),
      type: "table",
      sourceType: TableSourceType.INTERNAL,
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      schema: {
        user1: { ...linkField, name: "user1", fieldName: uuid.v4() },
        user2: { ...linkField, name: "user2", fieldName: uuid.v4() },
      },
    })

    const user1 = await config.createUser()
    const user2 = await config.createUser()

    const row = await config.api.row.save(table._id!, {
      user1: [{ _id: user1._id }],
      user2: [{ _id: user2._id }],
    })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .updateRow({
        rowId: row._id!,
        row: {
          _id: row._id,
          _rev: row._rev,
          tableId: row.tableId,
          user1: [user2._id],
          user2: "",
        },
        meta: {
          fields: {
            user2: {
              clearRelationships: true,
            },
          },
        },
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toEqual(true)

    const getResp = await config.api.row.get(table._id!, row._id!)
    expect(getResp.user1[0]._id).toEqual(user2._id)
    expect(getResp.user2).toBeUndefined()
  })
})

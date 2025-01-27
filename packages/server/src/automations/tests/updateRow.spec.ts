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
import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"

import * as setup from "./utilities"
import * as uuid from "uuid"

describe("test the update row action", () => {
  let table: Table,
    row: Row,
    config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
    table = await config.createTable()
    row = await config.createRow()
  })

  afterAll(setup.afterAll)

  it("should be able to run the update row action", async () => {
    const builder = createAutomationBuilder({
      name: "Update Row Automation",
    })

    const results = await builder
      .appAction({ fields: {} })
      .updateRow({
        rowId: row._id!,
        row: {
          ...row,
          name: "Updated name",
          description: "",
        },
        meta: {},
      })
      .run()

    expect(results.steps[0].outputs.success).toEqual(true)
    const updatedRow = await config.api.row.get(
      table._id!,
      results.steps[0].outputs.id
    )
    expect(updatedRow.name).toEqual("Updated name")
    expect(updatedRow.description).not.toEqual("")
  })

  it("should check invalid inputs return an error", async () => {
    const builder = createAutomationBuilder({
      name: "Invalid Inputs Automation",
    })

    const results = await builder
      .appAction({ fields: {} })
      .updateRow({ meta: {}, row: {}, rowId: "" })
      .run()

    expect(results.steps[0].outputs.success).toEqual(false)
  })

  it("should return an error when table doesn't exist", async () => {
    const builder = createAutomationBuilder({
      name: "Nonexistent Table Automation",
    })

    const results = await builder
      .appAction({ fields: {} })
      .updateRow({
        row: { _id: "invalid" },
        rowId: "invalid",
        meta: {},
      })
      .run()

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

    const builder = createAutomationBuilder({
      name: "Link Preservation Automation",
    })

    const results = await builder
      .appAction({ fields: {} })
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
      .run()

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

    const builder = createAutomationBuilder({
      name: "Link Overwrite Automation",
    })

    const results = await builder
      .appAction({ fields: {} })
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
      .run()

    expect(results.steps[0].outputs.success).toEqual(true)

    const getResp = await config.api.row.get(table._id!, row._id!)
    expect(getResp.user1[0]._id).toEqual(user2._id)
    expect(getResp.user2).toBeUndefined()
  })
})

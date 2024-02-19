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

import * as setup from "./utilities"
import * as uuid from "uuid"

describe("test the update row action", () => {
  let table: Table, row: Row, inputs: any
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
    table = await config.createTable()
    row = await config.createRow()
    inputs = {
      rowId: row._id,
      row: {
        ...row,
        name: "Updated name",
        // put a falsy option in to be removed
        description: "",
      },
    }
  })

  afterAll(setup.afterAll)

  it("should be able to run the action", async () => {
    const res = await setup.runStep(setup.actions.UPDATE_ROW.stepId, inputs)
    expect(res.success).toEqual(true)
    const updatedRow = await config.getRow(table._id!, res.id)
    expect(updatedRow.name).toEqual("Updated name")
    expect(updatedRow.description).not.toEqual("")
  })

  it("should check invalid inputs return an error", async () => {
    const res = await setup.runStep(setup.actions.UPDATE_ROW.stepId, {})
    expect(res.success).toEqual(false)
  })

  it("should return an error when table doesn't exist", async () => {
    const res = await setup.runStep(setup.actions.UPDATE_ROW.stepId, {
      row: { _id: "invalid" },
      rowId: "invalid",
    })
    expect(res.success).toEqual(false)
  })

  it("should not overwrite links if those links are not set", async () => {
    let linkField: FieldSchema = {
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

    let table = await config.api.table.save({
      name: uuid.v4(),
      type: "table",
      sourceType: TableSourceType.INTERNAL,
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      schema: {
        user1: { ...linkField, name: "user1", fieldName: uuid.v4() },
        user2: { ...linkField, name: "user2", fieldName: uuid.v4() },
      },
    })

    let user1 = await config.createUser()
    let user2 = await config.createUser()

    let row = await config.api.row.save(table._id!, {
      user1: [{ _id: user1._id }],
      user2: [{ _id: user2._id }],
    })

    let getResp = await config.api.row.get(table._id!, row._id!)
    expect(getResp.body.user1[0]._id).toEqual(user1._id)
    expect(getResp.body.user2[0]._id).toEqual(user2._id)

    let stepResp = await setup.runStep(setup.actions.UPDATE_ROW.stepId, {
      rowId: row._id,
      row: {
        _id: row._id,
        _rev: row._rev,
        tableId: row.tableId,
        user1: [user2._id],
        user2: "",
      },
    })
    expect(stepResp.success).toEqual(true)

    getResp = await config.api.row.get(table._id!, row._id!)
    expect(getResp.body.user1[0]._id).toEqual(user2._id)
    expect(getResp.body.user2[0]._id).toEqual(user2._id)
  })

  it("should overwrite links if those links are not set and we ask it do", async () => {
    let linkField: FieldSchema = {
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

    let table = await config.api.table.save({
      name: uuid.v4(),
      type: "table",
      sourceType: TableSourceType.INTERNAL,
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      schema: {
        user1: { ...linkField, name: "user1", fieldName: uuid.v4() },
        user2: { ...linkField, name: "user2", fieldName: uuid.v4() },
      },
    })

    let user1 = await config.createUser()
    let user2 = await config.createUser()

    let row = await config.api.row.save(table._id!, {
      user1: [{ _id: user1._id }],
      user2: [{ _id: user2._id }],
    })

    let getResp = await config.api.row.get(table._id!, row._id!)
    expect(getResp.body.user1[0]._id).toEqual(user1._id)
    expect(getResp.body.user2[0]._id).toEqual(user2._id)

    let stepResp = await setup.runStep(setup.actions.UPDATE_ROW.stepId, {
      rowId: row._id,
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
    expect(stepResp.success).toEqual(true)

    getResp = await config.api.row.get(table._id!, row._id!)
    expect(getResp.body.user1[0]._id).toEqual(user2._id)
    expect(getResp.body.user2).toBeUndefined()
  })
})

import TestConfig from "../../tests/utilities/TestConfiguration"
import {
  basicLinkedRow,
  basicRow,
  basicTable,
} from "../../tests/utilities/structures"
import LinkController from "../linkedRows/LinkController"
import { context } from "@budibase/backend-core"
import {
  FieldType,
  ManyToManyRelationshipFieldMetadata,
  ManyToOneRelationshipFieldMetadata,
  OneToManyRelationshipFieldMetadata,
  RelationshipFieldMetadata,
  RelationshipType,
  Row,
  Table,
} from "@budibase/types"
import { cloneDeep } from "lodash"

const baseColumn = {
  type: FieldType.LINK,
  fieldName: "",
  tableId: "",
  name: "",
}

function mockManyToManyColumn(): ManyToManyRelationshipFieldMetadata {
  return <ManyToManyRelationshipFieldMetadata>{
    ...baseColumn,
    through: "",
    throughFrom: "",
    throughTo: "",
    relationshipType: RelationshipType.MANY_TO_MANY,
  }
}

function mockManyToOneColumn(): ManyToOneRelationshipFieldMetadata {
  return <ManyToOneRelationshipFieldMetadata>{
    ...baseColumn,
    relationshipType: RelationshipType.MANY_TO_ONE,
  }
}

function mockOneToManyColumn(): OneToManyRelationshipFieldMetadata {
  return <OneToManyRelationshipFieldMetadata>{
    ...baseColumn,
    relationshipType: RelationshipType.ONE_TO_MANY,
  }
}

describe("test the link controller", () => {
  let config = new TestConfig()
  let table1: Table, table2: Table, appId: string

  beforeAll(async () => {
    const app = await config.init()
    appId = app.appId
  })

  beforeEach(async () => {
    const { _id } = await config.createTable()
    table2 = await config.createLinkedTable(RelationshipType.MANY_TO_MANY, [
      "link",
      "link2",
    ])
    // update table after creating link
    table1 = await config.getTable(_id)
  })

  afterAll(config.end)

  async function createLinkController(
    table: Table,
    row?: Row,
    oldTable?: Table
  ) {
    return context.doInAppContext(appId, () => {
      const linkConfig: {
        tableId?: string
        table: Table
        row?: Row
        oldTable?: Table
      } = {
        tableId: table._id,
        table,
      }
      if (row) {
        linkConfig.row = row
      }
      if (oldTable) {
        linkConfig.oldTable = oldTable
      }
      return new LinkController(linkConfig)
    })
  }

  async function createLinkedRow(linkField = "link", t1 = table1, t2 = table2) {
    const row = await config.createRow(basicRow(t2._id!))
    const { _id } = await config.createRow(
      basicLinkedRow(t1._id!, row._id!, linkField)
    )
    return config.api.row.get(t1._id!, _id!)
  }

  it("should be able to confirm if two table schemas are equal", async () => {
    const controller = await createLinkController(table1)
    let equal = controller.areLinkSchemasEqual(
      table2.schema.link,
      table2.schema.link
    )
    expect(equal).toEqual(true)
    equal = controller.areLinkSchemasEqual(
      table1.schema.link,
      table2.schema.link
    )
    expect(equal).toEqual(false)
  })

  it("should be able to check the relationship types across two fields", async () => {
    const controller = await createLinkController(table1)
    // empty case
    //@ts-ignore
    let output = controller.handleRelationshipType({}, {})
    expect(output.linkedField.relationshipType).toEqual(
      RelationshipType.MANY_TO_MANY
    )
    expect(output.linkerField.relationshipType).toEqual(
      RelationshipType.MANY_TO_MANY
    )
    output = controller.handleRelationshipType(
      mockManyToManyColumn(),
      {} as any
    )
    expect(output.linkedField.relationshipType).toEqual(
      RelationshipType.MANY_TO_MANY
    )
    expect(output.linkerField.relationshipType).toEqual(
      RelationshipType.MANY_TO_MANY
    )
    output = controller.handleRelationshipType(mockManyToOneColumn(), {} as any)
    expect(output.linkedField.relationshipType).toEqual(
      RelationshipType.ONE_TO_MANY
    )
    expect(output.linkerField.relationshipType).toEqual(
      RelationshipType.MANY_TO_ONE
    )
    output = controller.handleRelationshipType(mockOneToManyColumn(), {} as any)
    expect(output.linkedField.relationshipType).toEqual(
      RelationshipType.MANY_TO_ONE
    )
    expect(output.linkerField.relationshipType).toEqual(
      RelationshipType.ONE_TO_MANY
    )
  })

  it("should be able to delete a row", async () => {
    const row = await createLinkedRow()
    const controller = await createLinkController(table1, row)
    await context.doInAppContext(appId, async () => {
      // get initial count
      const beforeLinks = await controller.getRowLinkDocs(row._id!)
      await controller.rowDeleted()
      let afterLinks = await controller.getRowLinkDocs(row._id!)
      expect(beforeLinks.length).toEqual(1)
      expect(afterLinks.length).toEqual(0)
    })
  })

  it("shouldn't throw an error when deleting a row with no links", async () => {
    const row = await config.createRow(basicRow(table1._id!))
    const controller = await createLinkController(table1, row)
    await context.doInAppContext(appId, async () => {
      let error
      try {
        await controller.rowDeleted()
      } catch (err) {
        error = err
      }
      expect(error).toBeUndefined()
    })
  })

  it("should throw an error when validating a table which is invalid", async () => {
    const controller = await createLinkController(table1)
    const copyTable = {
      ...table1,
    }
    //@ts-ignore
    copyTable.schema.otherTableLink = {
      type: FieldType.LINK,
      fieldName: "link",
      tableId: table2._id!,
    }
    let error: any
    try {
      controller.validateTable(copyTable)
    } catch (err) {
      error = err
    }
    expect(error).toBeDefined()
    expect(error.message).toEqual(
      "Cannot re-use the linked column name for a linked table."
    )
  })

  it("should be able to remove a link when saving/updating the row", async () => {
    const row = await createLinkedRow()
    // remove the link from the row
    row.link = []
    const controller = await createLinkController(table1, row)
    await context.doInAppContext(appId, async () => {
      await controller.rowSaved()
      let links = await controller.getRowLinkDocs(row._id!)
      expect(links.length).toEqual(0)
    })
  })

  it("should be able to delete a table and have links deleted", async () => {
    await createLinkedRow()
    const controller = await createLinkController(table1)
    await context.doInAppContext(appId, async () => {
      let before = await controller.getTableLinkDocs()
      await controller.tableDeleted()
      let after = await controller.getTableLinkDocs()
      expect(before.length).toEqual(1)
      expect(after.length).toEqual(0)
    })
  })

  it("should be able to remove a linked field from a table", async () => {
    await createLinkedRow()
    await createLinkedRow("link2")
    const controller = await createLinkController(table1, undefined, table1)
    await context.doInAppContext(appId, async () => {
      let before = await controller.getTableLinkDocs()
      await controller.removeFieldFromTable("link")
      let after = await controller.getTableLinkDocs()
      expect(before.length).toEqual(2)
      // shouldn't delete the other field
      expect(after.length).toEqual(1)
    })
  })

  it("should throw an error when overwriting a link column", async () => {
    const update = cloneDeep(table1)
    const linkSchema = update.schema.link as ManyToOneRelationshipFieldMetadata
    linkSchema.relationshipType = RelationshipType.MANY_TO_ONE
    let error
    try {
      const controller = await createLinkController(update)
      await controller.tableSaved()
    } catch (err) {
      error = err
    }
    expect(error).toBeDefined()
  })

  it("should be able to remove a field view table update", async () => {
    await createLinkedRow()
    await createLinkedRow()
    const newTable = cloneDeep(table1)
    delete newTable.schema.link
    const controller = await createLinkController(newTable, undefined, table1)
    await context.doInAppContext(appId, async () => {
      await controller.tableUpdated()
      const links = await controller.getTableLinkDocs()
      expect(links.length).toEqual(0)
    })
  })

  it("shouldn't allow one to many having many relationships against it", async () => {
    const firstTable = await config.createTable()
    const { _id } = await config.createLinkedTable(
      RelationshipType.MANY_TO_ONE,
      ["link"]
    )
    const linkTable = await config.getTable(_id)
    // an initial row to link around
    const row = await createLinkedRow("link", linkTable, firstTable)
    let error
    try {
      // create another row to initiate the error
      await config.createRow(basicLinkedRow(row.tableId!, row.link[0]))
    } catch (err) {
      error = err
    }
    expect(error).toBeDefined()
  })

  it("should not error if a link being created doesn't exist", async () => {
    let error
    try {
      await config.createRow(basicLinkedRow(table1._id!, "invalid"))
    } catch (err) {
      error = err
    }
    expect(error).toBeUndefined()
  })

  it("make sure auto column goes onto other row too", async () => {
    const table = await config.createTable()
    const tableCfg = basicTable()
    //@ts-ignore
    tableCfg.schema.link = {
      type: FieldType.LINK,
      fieldName: "link",
      tableId: table._id!,
      name: "link",
      autocolumn: true,
    }
    await config.createTable(tableCfg)
    const afterTable = await config.getTable(table._id)
    expect(afterTable.schema.link.autocolumn).toBe(true)
  })

  it("should be able to link to self", async () => {
    const table = await config.createTable()
    //@ts-ignore
    table.schema.link = {
      type: FieldType.LINK,
      fieldName: "link",
      tableId: table._id!,
      name: "link",
      autocolumn: true,
    }
    await config.upsertTable(table)
  })

  it("should be able to remove a linked field from a table, even if the linked table does not exist", async () => {
    await createLinkedRow()
    await createLinkedRow("link2")
    const linkSchema = table1.schema["link"] as RelationshipFieldMetadata
    linkSchema.tableId = "not_found"
    const controller = await createLinkController(table1, undefined, table1)
    await context.doInAppContext(appId, async () => {
      let before = await controller.getTableLinkDocs()
      await controller.removeFieldFromTable("link")
      let after = await controller.getTableLinkDocs()
      expect(before.length).toEqual(2)
      // shouldn't delete the other field
      expect(after.length).toEqual(1)
    })
  })
})

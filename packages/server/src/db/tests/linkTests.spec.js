const TestConfig = require("../../tests/utilities/TestConfiguration")
const { basicTable, basicLinkedRow } = require("../../tests/utilities/structures")
const linkUtils = require("../linkedRows/linkUtils")
const links = require("../linkedRows")
const CouchDB = require("../index")

describe("test link functionality", () => {
  const config = new TestConfig(false)

  describe("getLinkedTable", () => {
    let db, table
    beforeEach(async () => {
      await config.init()
      db = new CouchDB(config.getAppId())
      table = await config.createTable()
    })

    it("should be able to retrieve a linked table from a list", async () => {
      const retrieved = await linkUtils.getLinkedTable(db, table._id, [table])
      expect(retrieved._id).toBe(table._id)
    })

    it("should be able to retrieve a table from DB and update list", async () => {
      const tables = []
      const retrieved = await linkUtils.getLinkedTable(db, table._id, tables)
      expect(retrieved._id).toBe(table._id)
      expect(tables[0]).toBeDefined()
    })
  })

  describe("getRelatedTableForField", () => {
    let link = basicTable()
    link.schema.link = {
      fieldName: "otherLink",
      tableId: "tableID",
      type: "link",
    }

    it("should get the field from the table directly", () => {
      expect(linkUtils.getRelatedTableForField(link, "link")).toBe("tableID")
    })

    it("should get the field from the link", () => {
      expect(linkUtils.getRelatedTableForField(link, "otherLink")).toBe("tableID")
    })
  })

  describe("getLinkDocuments", () => {
    it("should create the link view when it doesn't exist", async () => {
      // create the DB and a very basic app design DB
      const db = new CouchDB("test")
      await db.put({ _id: "_design/database", views: {} })
      const output = await linkUtils.getLinkDocuments({
        appId: "test",
        tableId: "test",
        rowId: "test",
        includeDocs: false,
      })
      expect(Array.isArray(output)).toBe(true)
    })
  })

  describe("attachLinkIDs", () => {
    it("should be able to attach linkIDs", async () => {
      await config.init()
      await config.createTable()
      const table = await config.createLinkedTable()
      const row = await config.createRow()
      const linkRow = await config.createRow(basicLinkedRow(table._id, row._id))
      const attached = await links.attachLinkIDs(config.getAppId(), [linkRow])
      expect(attached[0].link[0]).toBe(row._id)
    })
  })
})
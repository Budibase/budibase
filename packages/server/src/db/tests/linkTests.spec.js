const TestConfig = require("../../tests/utilities/TestConfiguration")
const { basicTable } = require("../../tests/utilities/structures")
const linkUtils = require("../linkedRows/linkUtils")
const { context } = require("@budibase/backend-core")

describe("test link functionality", () => {
  const config = new TestConfig()
  let appId

  describe("getLinkedTable", () => {
    let table
    beforeAll(async () => {
      const app = await config.init()
      appId = app.appId
      table = await config.createTable()
    })

    it("should be able to retrieve a linked table from a list", async () => {
      await context.doInAppContext(appId, async () => {
        const retrieved = await linkUtils.getLinkedTable(table._id, [table])
        expect(retrieved._id).toBe(table._id)
      })
    })

    it("should be able to retrieve a table from DB and update list", async () => {
      const tables = []
      await context.doInAppContext(appId, async () => {
        const retrieved = await linkUtils.getLinkedTable(table._id, tables)
        expect(retrieved._id).toBe(table._id)
        expect(tables[0]).toBeDefined()
      })
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
      await context.doInAppContext(appId, async () => {
        const output = await linkUtils.getLinkDocuments({
          tableId: "test",
          rowId: "test",
          includeDocs: false,
        })
        expect(Array.isArray(output)).toBe(true)
      })
    })
  })
})
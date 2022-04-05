require("../../tests/utilities/TestConfiguration")
const { mocks } = require("../../tests/utilities")
mocks.date.mock()
const { getDB, allDbs } = require("../")

describe("db", () => { 
  
  describe("getDB", () => {
    it("returns a db", async () => {
      const db = getDB("test")
      expect(db).toBeDefined()
      expect(db._adapter).toBe("memory")
      expect(db.prefix).toBe("_pouch_")
      expect(db.name).toBe("test")
    })

    it("uses the custom put function", async () => {
      const db = getDB("test")
      let doc = { _id: "test" }
      await db.put(doc)
      doc = await db.get(doc._id)
      expect(doc.createdAt).toBe(new Date().toISOString())
      expect(doc.updatedAt).toBe(new Date().toISOString())
      await db.destroy()
    })
  })

  describe("allDbs", () => {
    it("returns all dbs", async () => {
      let all = await allDbs()
      expect(all).toStrictEqual([])
      const db1 = getDB("test1")
      await db1.put({ _id: "test1" })
      const db2 = getDB("test2")
      await db2.put({ _id: "test2" })
      all = await allDbs()
      expect(all.length).toBe(2)
    })
  })
})


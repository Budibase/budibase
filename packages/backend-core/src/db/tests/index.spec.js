require("../../../tests")
const { structures } = require("../../../tests")
const { getDB } = require("../db")

describe("db", () => {
  describe("getDB", () => {
    it("returns a db", async () => {
      
      const dbName = structures.db.id()
      const db = getDB(dbName)
      expect(db).toBeDefined()
      expect(db.name).toBe(dbName)
    })

    it("uses the custom put function", async () => {
      const db = getDB(structures.db.id())
      let doc = { _id: "test" }
      await db.put(doc)
      doc = await db.get(doc._id)
      expect(doc.createdAt).toBe(new Date().toISOString())
      expect(doc.updatedAt).toBe(new Date().toISOString())
      await db.destroy()
    })
  })
})

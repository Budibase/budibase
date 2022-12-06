require("../../../tests")
const { getDB } = require("../")

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
})


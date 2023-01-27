require("../../../tests")
const { getDB } = require("../db")
const { faker } = require( "@faker-js/faker")

describe("db", () => {
  describe("getDB", () => {
    it("returns a db", async () => {
      const dbName = faker.random.alpha(10)
      const db = getDB(dbName)
      expect(db).toBeDefined()
      expect(db.name).toBe(dbName)
    })

    it("uses the custom put function", async () => {
      const db = getDB(faker.random.alpha(10))
      let doc = { _id: "test" }
      await db.put(doc)
      doc = await db.get(doc._id)
      expect(doc.createdAt).toBe(new Date().toISOString())
      expect(doc.updatedAt).toBe(new Date().toISOString())
      await db.destroy()
    })
  })
})

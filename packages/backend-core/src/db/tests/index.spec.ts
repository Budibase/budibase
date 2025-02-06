import { doInTenant } from "../../context"
import { structures } from "../../../tests"
import { getDB } from "../db"

interface Doc {
  _id: string
  createdAt?: string
  updatedAt?: string
}

describe("db", () => {
  describe("getDB", () => {
    it("returns a db", async () => {
      const dbName = structures.db.id()
      const db = getDB(dbName)
      expect(db).toBeDefined()
      expect(db.name).toBe(dbName)
    })

    it("uses the custom put function", async () => {
      await doInTenant("foo", async () => {
        const db = getDB(structures.db.id())
        let doc: Doc = { _id: "test" }
        await db.put(doc)
        doc = await db.get(doc._id)
        expect(doc.createdAt).toBe(new Date().toISOString())
        expect(doc.updatedAt).toBe(new Date().toISOString())
        await db.destroy()
      })
    })
  })
})

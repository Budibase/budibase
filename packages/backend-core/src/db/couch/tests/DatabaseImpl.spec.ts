import tk from "timekeeper"

import { DatabaseImpl } from ".."

import { generator, structures } from "../../../../tests"

const initialTime = new Date()
tk.freeze(initialTime)

describe("DatabaseImpl", () => {
  const db = new DatabaseImpl(structures.db.id())

  beforeEach(() => {
    tk.freeze(initialTime)
  })

  describe("put", () => {
    it("persists createdAt and updatedAt fields", async () => {
      const id = generator.guid()
      await db.put({ _id: id })

      expect(await db.get(id)).toEqual({
        _id: id,
        _rev: expect.any(String),
        createdAt: initialTime.toISOString(),
        updatedAt: initialTime.toISOString(),
      })
    })

    it("updates updated at fields", async () => {
      const id = generator.guid()

      await db.put({ _id: id })
      tk.travel(100)

      await db.put({ ...(await db.get(id)), newValue: 123 })

      expect(await db.get(id)).toEqual({
        _id: id,
        _rev: expect.any(String),
        newValue: 123,
        createdAt: initialTime.toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })
  })
})

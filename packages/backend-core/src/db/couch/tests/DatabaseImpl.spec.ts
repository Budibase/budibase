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

  describe("bulkDocs", () => {
    it("persists createdAt and updatedAt fields", async () => {
      const ids = generator.unique(() => generator.guid(), 5)
      await db.bulkDocs(ids.map(id => ({ _id: id })))

      for (const id of ids) {
        expect(await db.get(id)).toEqual({
          _id: id,
          _rev: expect.any(String),
          createdAt: initialTime.toISOString(),
          updatedAt: initialTime.toISOString(),
        })
      }
    })

    it("updates updated at fields", async () => {
      const ids = generator.unique(() => generator.guid(), 5)

      await db.bulkDocs(ids.map(id => ({ _id: id })))
      tk.travel(100)

      const docsToUpdate = await Promise.all(
        ids.map(async id => ({ ...(await db.get(id)), newValue: 123 }))
      )
      await db.bulkDocs(docsToUpdate)

      for (const id of ids) {
        expect(await db.get(id)).toEqual({
          _id: id,
          _rev: expect.any(String),
          newValue: 123,
          createdAt: initialTime.toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    })

    it("keeps existing createdAt", async () => {
      const ids = generator.unique(() => generator.guid(), 2)

      await db.bulkDocs(ids.map(id => ({ _id: id })))
      tk.travel(100)

      const newDocs = generator
        .unique(() => generator.guid(), 3)
        .map(id => ({ _id: id }))
      const docsToUpdate = await Promise.all(
        ids.map(async id => ({ ...(await db.get(id)), newValue: 123 }))
      )
      await db.bulkDocs([...newDocs, ...docsToUpdate])

      for (const { _id } of docsToUpdate) {
        expect(await db.get(_id)).toEqual({
          _id,
          _rev: expect.any(String),
          newValue: 123,
          createdAt: initialTime.toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
      for (const { _id } of newDocs) {
        expect(await db.get(_id)).toEqual({
          _id,
          _rev: expect.any(String),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    })
  })
})

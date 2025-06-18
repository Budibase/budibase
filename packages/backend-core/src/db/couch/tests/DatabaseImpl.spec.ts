import tk from "timekeeper"

import { DatabaseImpl } from ".."

import { generator, structures } from "../../../../tests"
import environment from "../../../environment"

const initialTime = new Date()
tk.freeze(initialTime)

describe("DatabaseImpl", () => {
  const db = new DatabaseImpl(structures.db.id())

  let mockedVersion: string

  function generateNewMockedVersion() {
    mockedVersion = structures.semver()

    environment._set("VERSION", mockedVersion)
  }

  beforeEach(() => {
    tk.freeze(initialTime)

    generateNewMockedVersion()
  })

  describe("post", () => {
    it("persists createdAt, updatedAt and createdVersion fields", async () => {
      const id = generator.guid()
      await db.post({ _id: id })

      expect(await db.get(id)).toEqual({
        _id: id,
        _rev: expect.any(String),
        createdAt: initialTime.toISOString(),
        updatedAt: initialTime.toISOString(),
        createdVersion: mockedVersion,
      })
    })
  })

  describe("put", () => {
    it("persists createdAt, updatedAt and createdVersion fields", async () => {
      const id = generator.guid()
      await db.put({ _id: id })

      expect(await db.get(id)).toEqual({
        _id: id,
        _rev: expect.any(String),
        createdAt: initialTime.toISOString(),
        updatedAt: initialTime.toISOString(),
        createdVersion: mockedVersion,
      })
    })

    it("updates updatedAt, keeping createdAt and createdVersion fields", async () => {
      const id = generator.guid()

      await db.put({ _id: id })
      tk.travel(100)

      const createdVersion = mockedVersion
      generateNewMockedVersion()

      await db.put({ ...(await db.get(id)), newValue: 123 })

      expect(await db.get(id)).toEqual({
        _id: id,
        _rev: expect.any(String),
        newValue: 123,
        createdAt: initialTime.toISOString(),
        updatedAt: new Date().toISOString(),
        createdVersion: createdVersion,
      })
    })
  })

  describe("bulkDocs", () => {
    it("persists createdAt, updatedAt and createdVersion fields", async () => {
      const ids = generator.unique(() => generator.guid(), 5)
      await db.bulkDocs(ids.map(id => ({ _id: id })))

      for (const id of ids) {
        expect(await db.get(id)).toEqual({
          _id: id,
          _rev: expect.any(String),
          createdAt: initialTime.toISOString(),
          updatedAt: initialTime.toISOString(),
          createdVersion: mockedVersion,
        })
      }
    })

    it("updates updated at fields", async () => {
      const ids = generator.unique(() => generator.guid(), 5)

      await db.bulkDocs(ids.map(id => ({ _id: id })))
      tk.travel(100)

      const createdVersion = mockedVersion
      generateNewMockedVersion()
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
          createdVersion: createdVersion,
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
          createdVersion: mockedVersion,
        })
      }
      for (const { _id } of newDocs) {
        expect(await db.get(_id)).toEqual({
          _id,
          _rev: expect.any(String),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdVersion: mockedVersion,
        })
      }
    })
  })
})

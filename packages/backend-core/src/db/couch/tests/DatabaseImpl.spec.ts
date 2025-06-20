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

    it("handles empty array", async () => {
      const result = await db.bulkDocs([])
      expect(result).toEqual([])
    })
  })

  describe("get", () => {
    it("throws error when no id provided", async () => {
      await expect(db.get()).rejects.toThrow(
        "Unable to get doc without a valid _id."
      )
    })

    it("throws error when document not found", async () => {
      const id = generator.guid()
      await expect(db.get(id)).rejects.toThrow()
    })
  })

  describe("tryGet", () => {
    it("returns document when it exists", async () => {
      const id = generator.guid()
      const doc = { _id: id, value: "test" }
      await db.post(doc)

      const result = await db.tryGet(id)
      expect(result).toEqual({
        _id: id,
        _rev: expect.any(String),
        value: "test",
        createdAt: initialTime.toISOString(),
        updatedAt: initialTime.toISOString(),
        createdVersion: mockedVersion,
      })
    })

    it("returns undefined when document does not exist", async () => {
      const id = generator.guid()
      const result = await db.tryGet(id)
      expect(result).toBeUndefined()
    })
  })

  describe("getMultiple", () => {
    it("returns documents that exist", async () => {
      const ids = generator.unique(() => generator.guid(), 3)
      await db.bulkDocs(ids.map(id => ({ _id: id, value: id })))

      const result = await db.getMultiple(ids)
      expect(result).toHaveLength(3)
      result.forEach((doc, index) => {
        expect(doc).toEqual({
          _id: ids[index],
          _rev: expect.any(String),
          value: ids[index],
          createdAt: initialTime.toISOString(),
          updatedAt: initialTime.toISOString(),
          createdVersion: mockedVersion,
        })
      })
    })

    it("returns empty array for empty ids", async () => {
      const result = await db.getMultiple([])
      expect(result).toEqual([])
    })

    it("filters out missing documents when allowMissing is true", async () => {
      const existingIds = generator.unique(() => generator.guid(), 2)
      const missingIds = generator.unique(() => generator.guid(), 2)

      await db.bulkDocs(existingIds.map(id => ({ _id: id, value: id })))

      const result = await db.getMultiple([...existingIds, ...missingIds], {
        allowMissing: true,
      })
      expect(result).toHaveLength(2)
    })

    it("throws error when some documents are missing and allowMissing is false", async () => {
      const existingIds = generator.unique(() => generator.guid(), 1)
      const missingIds = generator.unique(() => generator.guid(), 1)

      await db.bulkDocs(existingIds.map(id => ({ _id: id, value: id })))

      await expect(
        db.getMultiple([...existingIds, ...missingIds])
      ).rejects.toThrow("Unable to get bulk documents")
    })

    it("removes duplicates from ids", async () => {
      const id = generator.guid()
      await db.post({ _id: id, value: "test" })

      const result = await db.getMultiple([id, id, id])
      expect(result).toHaveLength(1)
    })
  })

  describe("exists", () => {
    it("returns true for existing document", async () => {
      const id = generator.guid()
      await db.post({ _id: id })

      const exists = await db.exists(id)
      expect(exists).toBe(true)
    })

    it("returns false for non-existing document", async () => {
      const id = generator.guid()
      const exists = await db.exists(id)
      expect(exists).toBe(false)
    })
  })

  describe("remove", () => {
    it("removes document by id and rev", async () => {
      const id = generator.guid()
      const doc = await db.post({ _id: id, value: "test" })

      await db.remove(id, doc.rev)

      const exists = await db.exists(id)
      expect(exists).toBe(false)
    })

    it("removes document by document object", async () => {
      const id = generator.guid()
      await db.post({ _id: id, value: "test" })
      const doc = await db.get(id)

      await db.remove(doc)

      const exists = await db.exists(id)
      expect(exists).toBe(false)
    })

    it("throws error when no id provided", async () => {
      await expect(db.remove("", "1-rev")).rejects.toThrow(
        "Unable to remove doc without a valid _id and _rev."
      )
    })

    it("throws error when no rev provided", async () => {
      const id = generator.guid()
      await expect(db.remove(id, "")).rejects.toThrow(
        "Unable to remove doc without a valid _id and _rev."
      )
    })
  })

  describe("bulkRemove", () => {
    it("removes multiple documents", async () => {
      const ids = generator.unique(() => generator.guid(), 3)
      await db.bulkDocs(ids.map(id => ({ _id: id, value: id })))

      const docs = await db.getMultiple(ids)
      await db.bulkRemove(docs)

      for (const id of ids) {
        const exists = await db.exists(id)
        expect(exists).toBe(false)
      }
    })

    it("errors when incorrect rev is passed", async () => {
      const ids = generator.unique(() => generator.guid(), 3)
      await db.bulkDocs(ids.map(id => ({ _id: id, value: id })))

      const docs = [{ _id: ids[0], _rev: "1-fakerev" }]

      await expect(db.bulkRemove(docs)).rejects.toThrow(
        "Unable to bulk remove documents: conflict"
      )
    })

    it("silences errors when silenceErrors is true", async () => {
      const ids = generator.unique(() => generator.guid(), 3)
      await db.bulkDocs(ids.map(id => ({ _id: id, value: id })))

      const docs = [{ _id: ids[0], _rev: "1-fakerev" }]

      const result = await db.bulkRemove(docs, { silenceErrors: true })

      expect(result).toBeUndefined()
    })
  })
})

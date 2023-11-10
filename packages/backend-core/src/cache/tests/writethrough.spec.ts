import { DBTestConfiguration } from "../../../tests/extra"
import {
  structures,
  expectFunctionWasCalledTimesWith,
  mocks,
} from "../../../tests"
import { Writethrough } from "../writethrough"
import { getDB } from "../../db"
import tk from "timekeeper"

tk.freeze(Date.now())

const DELAY = 5000

describe("writethrough", () => {
  const config = new DBTestConfiguration()

  const db = getDB(structures.db.id())
  const db2 = getDB(structures.db.id())

  const writethrough = new Writethrough(db, DELAY)
  const writethrough2 = new Writethrough(db2, DELAY)

  const docId = structures.uuid()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("put", () => {
    let current: any

    it("should be able to store, will go to DB", async () => {
      await config.doInTenant(async () => {
        const response = await writethrough.put({
          _id: docId,
          value: 1,
        })
        const output = await db.get<any>(response.id)
        current = output
        expect(output.value).toBe(1)
      })
    })

    it("second put shouldn't update DB", async () => {
      await config.doInTenant(async () => {
        const response = await writethrough.put({ ...current, value: 2 })
        const output = await db.get<any>(response.id)
        expect(current._rev).toBe(output._rev)
        expect(output.value).toBe(1)
      })
    })

    it("should put it again after delay period", async () => {
      await config.doInTenant(async () => {
        tk.freeze(Date.now() + DELAY + 1)
        const response = await writethrough.put({ ...current, value: 3 })
        const output = await db.get<any>(response.id)
        expect(response.rev).not.toBe(current._rev)
        expect(output.value).toBe(3)

        current = output
      })
    })

    it("should handle parallel DB updates ignoring conflicts", async () => {
      await config.doInTenant(async () => {
        tk.freeze(Date.now() + DELAY + 1)
        const responses = await Promise.all([
          writethrough.put({ ...current, value: 4 }),
          writethrough.put({ ...current, value: 4 }),
          writethrough.put({ ...current, value: 4 }),
        ])

        // with a lock, this will work
        const newRev = responses.map(x => x.rev).find(x => x !== current._rev)
        expect(newRev).toBeDefined()
        expect(responses.map(x => x.rev)).toEqual(
          expect.arrayContaining([current._rev, current._rev, newRev])
        )

        const output = await db.get<any>(current._id)
        expect(output.value).toBe(4)
        expect(output._rev).toBe(newRev)

        current = output
      })
    })

    it("should handle updates with documents falling behind", async () => {
      await config.doInTenant(async () => {
        tk.freeze(Date.now() + DELAY + 1)

        const id = structures.uuid()
        await writethrough.put({ _id: id, value: 1 })
        const doc = await writethrough.get(id)

        // Updating document
        tk.freeze(Date.now() + DELAY + 1)
        await writethrough.put({ ...doc, value: 2 })

        // Update with the old rev value
        tk.freeze(Date.now() + DELAY + 1)
        const res = await writethrough.put({
          ...doc,
          value: 3,
        })
        expect(res.ok).toBe(true)

        const output = await db.get<any>(id)
        expect(output.value).toBe(3)
        expect(output._rev).toBe(res.rev)
      })
    })
  })

  describe("get", () => {
    it("should be able to retrieve", async () => {
      await config.doInTenant(async () => {
        const response = await writethrough.get(docId)
        expect(response.value).toBe(4)
      })
    })
  })

  describe("same doc, different databases (tenancy)", () => {
    it("should be able to two different databases", async () => {
      await config.doInTenant(async () => {
        const resp1 = await writethrough.put({ _id: "db1", value: "first" })
        const resp2 = await writethrough2.put({ _id: "db1", value: "second" })
        expect(resp1.rev).toBeDefined()
        expect(resp2.rev).toBeDefined()
        expect((await db.get<any>("db1")).value).toBe("first")
        expect((await db2.get<any>("db1")).value).toBe("second")
      })
    })
  })
})

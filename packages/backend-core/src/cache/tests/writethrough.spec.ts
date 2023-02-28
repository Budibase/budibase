import {
  structures,
  DBTestConfiguration,
  expectFunctionWasCalledTimesWith,
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
        const output = await db.get(response.id)
        current = output
        expect(output.value).toBe(1)
      })
    })

    it("second put shouldn't update DB", async () => {
      await config.doInTenant(async () => {
        const response = await writethrough.put({ ...current, value: 2 })
        const output = await db.get(response.id)
        expect(current._rev).toBe(output._rev)
        expect(output.value).toBe(1)
      })
    })

    it("should put it again after delay period", async () => {
      await config.doInTenant(async () => {
        tk.freeze(Date.now() + DELAY + 1)
        const response = await writethrough.put({ ...current, value: 3 })
        const output = await db.get(response.id)
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

        const newRev = responses.map(x => x.rev).find(x => x !== current._rev)
        expect(newRev).toBeDefined()
        expect(responses.map(x => x.rev)).toEqual(
          expect.arrayContaining([current._rev, current._rev, newRev])
        )
        expectFunctionWasCalledTimesWith(
          console.warn,
          2,
          "bb-warn: Ignoring redlock conflict in write-through cache"
        )
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
        expect((await db.get("db1")).value).toBe("first")
        expect((await db2.get("db1")).value).toBe("second")
      })
    })
  })
})

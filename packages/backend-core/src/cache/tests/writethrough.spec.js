require("../../../tests")
const { Writethrough } = require("../writethrough")
const { getDB } = require("../../db")
const tk = require("timekeeper")

const START_DATE = Date.now()
tk.freeze(START_DATE)

const DELAY = 5000

const db = getDB("test")
const db2 = getDB("test2")
const writethrough = new Writethrough(db, DELAY), writethrough2 = new Writethrough(db2, DELAY)

describe("writethrough", () => {
  describe("put", () => {
    let first
    it("should be able to store, will go to DB", async () => {
      const response = await writethrough.put({ _id: "test", value: 1 })
      const output = await db.get(response.id)
      first = output
      expect(output.value).toBe(1)
    })

    it("second put shouldn't update DB", async () => {
      const response = await writethrough.put({ ...first, value: 2 })
      const output = await db.get(response.id)
      expect(first._rev).toBe(output._rev)
      expect(output.value).toBe(1)
    })

    it("should put it again after delay period", async () => {
      tk.freeze(START_DATE + DELAY + 1)
      const response = await writethrough.put({ ...first, value: 3 })
      const output = await db.get(response.id)
      expect(response.rev).not.toBe(first._rev)
      expect(output.value).toBe(3)
    })
  })

  describe("get", () => {
    it("should be able to retrieve", async () => {
      const response = await writethrough.get("test")
      expect(response.value).toBe(3)
    })
  })

  describe("same doc, different databases (tenancy)", () => {
    it("should be able to two different databases", async () => {
      const resp1 = await writethrough.put({ _id: "db1", value: "first" })
      const resp2 = await writethrough2.put({ _id: "db1", value: "second" })
      expect(resp1.rev).toBeDefined()
      expect(resp2.rev).toBeDefined()
      expect((await db.get("db1")).value).toBe("first")
      expect((await db2.get("db1")).value).toBe("second")
    })
  })
})


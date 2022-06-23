require("../../../tests/utilities/TestConfiguration")
const { Writethrough } = require("../writethrough")
const { dangerousGetDB } = require("../../db")
const tk = require("timekeeper")

const START_DATE = Date.now()
tk.freeze(START_DATE)

const DELAY = 5000

const db = dangerousGetDB("test")
const writethrough = new Writethrough(db)

describe("writethrough", () => {
  describe("put", () => {
    let first
    it("should be able to store, will go to DB", async () => {
      const response = await writethrough.put({ _id: "test", value: 1 }, DELAY)
      const output = await db.get(response._id)
      first = output
      expect(output.value).toBe(1)
    })

    it("second put shouldn't update DB", async () => {
      const response = await writethrough.put({ ...first, value: 2 }, DELAY)
      const output = await db.get(response._id)
      expect(first._rev).toBe(output._rev)
      expect(output.value).toBe(1)
    })

    it("should put it again after delay period", async () => {
      tk.freeze(START_DATE + DELAY + 1)
      const response = await writethrough.put({ ...first, value: 3 }, DELAY)
      const output = await db.get(response._id)
      expect(response._rev).not.toBe(first._rev)
      expect(output.value).toBe(3)
    })
  })

  describe("get", () => {
    it("should be able to retrieve", async () => {
      const response = await writethrough.get("test")
      expect(response.value).toBe(3)
    })
  })
})


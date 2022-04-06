const { structures } = require("./utilities")
const utils = require("../utils")
const events = require("../events")

describe("utils", () => {
  describe("platformLogout", () => {
    it("should call platform logout", async () => {
      const ctx = structures.koa.newContext()
      await utils.platformLogout({ ctx, userId: "test" })
      expect(events.auth.logout.mock.calls.length).toBe(1)
    })
  })
})
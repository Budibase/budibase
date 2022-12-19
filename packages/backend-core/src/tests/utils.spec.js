const { structures } = require("../../tests")
const utils = require("../utils")
const events = require("../events")
const { DEFAULT_TENANT_ID } = require("../constants")
const { doInTenant } = require("../context")

describe("utils", () => {
  describe("platformLogout", () => {
    it("should call platform logout", async () => {
      await doInTenant(DEFAULT_TENANT_ID, async () => {
        const ctx = structures.koa.newContext()
        await utils.platformLogout({ ctx, userId: "test" })
        expect(events.auth.logout).toBeCalledTimes(1)
      })
    })
  })
})
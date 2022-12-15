import { structures } from "../../../tests"
import * as utils from "../../utils"
import * as events from "../../events"
import { DEFAULT_TENANT_ID } from "../../constants"
import { doInTenant } from "../../context"

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

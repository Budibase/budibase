import { structures } from "../../../tests"
import { testEnv } from "../../../tests/extra"
import * as auth from "../auth"
import * as events from "../../events"

describe("platformLogout", () => {
  it("should call platform logout", async () => {
    await testEnv.withTenant(async () => {
      const ctx = structures.koa.newContext()
      await auth.platformLogout({ ctx, userId: "test" })
      expect(events.auth.logout).toBeCalledTimes(1)
    })
  })
})

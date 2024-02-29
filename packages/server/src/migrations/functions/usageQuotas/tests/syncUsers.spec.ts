import TestConfig from "../../../../tests/utilities/TestConfiguration"
import * as syncUsers from "../syncUsers"
import { quotas } from "@budibase/pro"

describe("syncUsers", () => {
  let config = new TestConfig(false)

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)

  it("syncs users", async () => {
    return config.doInContext(undefined, async () => {
      await config.createUser()

      await syncUsers.run()

      const usageDoc = await quotas.getQuotaUsage()
      // default + additional user
      const userCount = 2
      expect(usageDoc.usageQuota.users).toBe(userCount)
    })
  })
})

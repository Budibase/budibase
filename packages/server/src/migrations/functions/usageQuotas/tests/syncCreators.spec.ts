import TestConfig from "../../../../tests/utilities/TestConfiguration"
import * as syncCreators from "../syncCreators"
import { quotas } from "@budibase/pro"

describe("syncCreators", () => {
  let config = new TestConfig(false)

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)

  it("syncs creators", async () => {
    return config.doInContext(null, async () => {
      await config.createUser({ admin: true })

      await syncCreators.run()

      const usageDoc = await quotas.getQuotaUsage()
      // default + additional creator
      const creatorsCount = 2
      expect(usageDoc.usageQuota.creators).toBe(creatorsCount)
    })
  })
})

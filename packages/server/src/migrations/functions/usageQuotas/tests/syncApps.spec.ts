import TestConfig from "../../../../tests/utilities/TestConfiguration"
import * as syncApps from "../syncApps"
import { quotas } from "@budibase/pro"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

describe("syncApps", () => {
  let config = new TestConfig(false)

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)

  it("runs successfully", async () => {
    return config.doInContext(null, async () => {
      // create the usage quota doc and mock usages
      await quotas.getQuotaUsage()
      await quotas.setUsage(3, StaticQuotaName.APPS, QuotaUsageType.STATIC)

      let usageDoc = await quotas.getQuotaUsage()
      expect(usageDoc.usageQuota.apps).toEqual(3)

      // create an extra app to test the migration
      await config.createApp("quota-test")

      // migrate
      await syncApps.run()

      // assert the migration worked
      usageDoc = await quotas.getQuotaUsage()
      expect(usageDoc.usageQuota.apps).toEqual(2)
    })
  })
})

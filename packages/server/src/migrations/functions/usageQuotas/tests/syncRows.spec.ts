import TestConfig from "../../../../tests/utilities/TestConfiguration"
import * as syncRows from "../syncRows"
import { quotas } from "@budibase/pro"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"
import { db as dbCore, context } from "@budibase/backend-core"

describe("syncRows", () => {
  const config = new TestConfig()

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)

  it("runs successfully", async () => {
    return config.doInContext(undefined, async () => {
      // create the usage quota doc and mock usages
      await quotas.getQuotaUsage()
      await quotas.setUsage(300, StaticQuotaName.ROWS, QuotaUsageType.STATIC)

      let usageDoc = await quotas.getQuotaUsage()
      expect(usageDoc.usageQuota.rows).toEqual(300)

      // app 1
      const app1 = config.app
      await context.doInAppContext(app1!.appId, async () => {
        await config.createTable()
        await config.createRow()
      })
      // app 2
      const app2 = await config.createApp("second-app")
      await context.doInAppContext(app2.appId, async () => {
        await config.createTable()
        await config.createRow()
        await config.createRow()
      })

      // migrate
      await syncRows.run()

      // assert the migration worked
      usageDoc = await quotas.getQuotaUsage()
      expect(usageDoc.usageQuota.rows).toEqual(3)
      expect(
        usageDoc.apps?.[dbCore.getProdAppID(app1!.appId)].usageQuota.rows
      ).toEqual(1)
      expect(
        usageDoc.apps?.[dbCore.getProdAppID(app2.appId)].usageQuota.rows
      ).toEqual(2)
    })
  })
})

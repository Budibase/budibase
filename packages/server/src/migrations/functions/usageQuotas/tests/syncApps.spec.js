const { doInTenant, getGlobalDB } = require("@budibase/backend-core/tenancy")
const TestConfig = require("../../../../tests/utilities/TestConfiguration")
const { TENANT_ID } = require("../../../../tests/utilities/structures")
const { getUsageQuotaDoc, update, Properties } = require("../../../../utilities/usageQuota")
const syncApps = require("../syncApps")
const env = require("../../../../environment")

describe("syncApps", () => {

  let config = new TestConfig(false)

    beforeEach(async () => {
      await config.init()
      env._set("USE_QUOTAS", 1)
    })

    afterAll(config.end)

    it("runs successfully", async () => {
      await doInTenant(TENANT_ID, async () => {
        const db = getGlobalDB()
        // create the usage quota doc and mock usages
        await getUsageQuotaDoc(db)
        await update(Properties.APPS, 3)

        let usageDoc = await getUsageQuotaDoc(db)
        expect(usageDoc.usageQuota.apps).toEqual(3)

        // create an extra app to test the migration
        await config.createApp("quota-test")

        // migrate
        await syncApps.run()

        // assert the migration worked
        usageDoc = await getUsageQuotaDoc(db)
        expect(usageDoc.usageQuota.apps).toEqual(2)
      })
    })
})


const { getGlobalDB } = require("@budibase/auth/tenancy")
const TestConfig = require("../../tests/utilities/TestConfiguration")
const { getUsageQuotaDoc, update, Properties } = require("../../utilities/usageQuota")
const { runIfRequired } = require("../sync_app_and_reset_rows_quotas")
const env = require("../../environment")

describe("Sync App And Reset Rows Quotas Migration", () => {
  let config = new TestConfig(false)

  beforeEach(async () => {
    await config.init()
    env._set("USE_QUOTAS", 1)
  })

  afterAll(config.end)

  it("migrates successfully", async () => {
    // create the usage quota doc and mock usages
    const db = getGlobalDB()
    await getUsageQuotaDoc(db)
    await update(Properties.APPS, 3)
    await update(Properties.ROW, 300)

    let usageDoc = await getUsageQuotaDoc(db)
    expect(usageDoc.usageQuota.apps).toEqual(3)
    expect(usageDoc.usageQuota.rows).toEqual(300)

    // create an extra app to test the migration
    await config.createApp("quota-test")

    // migrate
    await runIfRequired()

    // assert the migration worked 
    usageDoc = await getUsageQuotaDoc(db)
    expect(usageDoc.usageQuota.apps).toEqual(2)
    expect(usageDoc.usageQuota.rows).toEqual(0)
  })
})

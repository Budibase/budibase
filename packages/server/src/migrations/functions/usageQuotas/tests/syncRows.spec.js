const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const TestConfig = require("../../../../tests/utilities/TestConfiguration")
const { getUsageQuotaDoc, update, Properties } = require("../../../../utilities/usageQuota")
const syncRows = require("../syncRows")
const env = require("../../../../environment")

describe("syncRows", () => {
  let config = new TestConfig(false)

  beforeEach(async () => {
    await config.init()
    env._set("USE_QUOTAS", 1)
  })

  afterAll(config.end)  

  it("runs successfully", async () => {
    // create the usage quota doc and mock usages
    const db = getGlobalDB()
    await getUsageQuotaDoc(db)
    await update(Properties.ROW, 300)

    let usageDoc = await getUsageQuotaDoc(db)
    expect(usageDoc.usageQuota.rows).toEqual(300)

    // app 1
    await config.createTable()
    await config.createRow()
    // app 2
    await config.createApp("second-app")
    await config.createTable()
    await config.createRow()
    await config.createRow()
    
    // migrate
    await syncRows.run()

    // assert the migration worked 
    usageDoc = await getUsageQuotaDoc(db)
    expect(usageDoc.usageQuota.rows).toEqual(3)
  })
})


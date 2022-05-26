const TestConfig = require("../../../tests/utilities/TestConfiguration")

const syncApps = jest.fn()
const syncRows = jest.fn()

jest.mock("../usageQuotas/syncApps", () => ({ run: syncApps }) )
jest.mock("../usageQuotas/syncRows", () => ({ run: syncRows }) )

const migration = require("../quotas2")

describe("run", () => {
  let config = new TestConfig(false)

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)  

  it("runs ", async () => {
    await migration.run()
    expect(syncApps).toHaveBeenCalledTimes(1)
    expect(syncRows).toHaveBeenCalledTimes(1)
  })
})

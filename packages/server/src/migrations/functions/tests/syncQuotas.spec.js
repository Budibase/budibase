const syncApps = jest.fn()
const syncRows = jest.fn()
const syncPlugins = jest.fn()
jest.mock("../usageQuotas/syncApps", () => ({ run: syncApps }) )
jest.mock("../usageQuotas/syncRows", () => ({ run: syncRows }) )
jest.mock("../usageQuotas/syncPlugins", () => ({ run: syncPlugins }) )

const TestConfig = require("../../../tests/utilities/TestConfiguration")
const migration = require("../syncQuotas")

describe("run", () => {
  let config = new TestConfig(false)

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)  

  it("run", async () => {
    await migration.run()
    expect(syncApps).toHaveBeenCalledTimes(1)
    expect(syncRows).toHaveBeenCalledTimes(1)
    expect(syncPlugins).toHaveBeenCalledTimes(1)
  })
})

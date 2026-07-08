import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("Slack app config routes", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  it("rejects global builders", async () => {
    const builder = await config.globalUser({
      builder: { global: true },
      admin: { global: false },
    })

    await config.withUser(builder, async () => {
      await config.api.ai.fetchSlackAppConfig({ status: 403 })
      await config.api.ai.saveSlackAppConfig(
        {
          configToken: "xoxe-test-token",
          refreshToken: "xoxe-test-refresh-token",
        },
        { status: 403 }
      )
      await config.api.ai.deleteSlackAppConfig({ status: 403 })
    })
  })

  it("allows admins", async () => {
    const admin = await config.globalUser({
      builder: { global: true },
      admin: { global: true },
    })

    await config.withUser(admin, async () => {
      let response = await config.api.ai.fetchSlackAppConfig()
      expect(response.configured).toBe(false)

      response = await config.api.ai.saveSlackAppConfig({
        configToken: "xoxe-test-token",
        refreshToken: "xoxe-test-refresh-token",
      })
      expect(response.configured).toBe(true)

      response = await config.api.ai.deleteSlackAppConfig()
      expect(response.configured).toBe(false)
    })
  })
})

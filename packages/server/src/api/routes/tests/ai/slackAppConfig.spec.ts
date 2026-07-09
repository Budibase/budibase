import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

const slackJsonResponse = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })

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

  afterEach(() => {
    if (jest.isMockFunction(global.fetch)) {
      jest.mocked(global.fetch).mockRestore()
    }
  })

  it("allows builders to read the config status", async () => {
    const admin = await config.globalUser({
      builder: { global: true },
      admin: { global: true },
    })
    const builder = await config.globalUser({
      builder: { global: true },
      admin: { global: false },
    })

    jest.spyOn(global, "fetch").mockResolvedValue(
      slackJsonResponse({
        ok: true,
        token: "xoxe-rotated-config-token",
        refresh_token: "xoxe-rotated-refresh-token",
        exp: Math.floor(Date.now() / 1000) + 43200,
      })
    )

    await config.withUser(admin, async () => {
      await config.api.ai.saveSlackAppConfig({
        configToken: "xoxe-test-token",
        refreshToken: "xoxe-test-refresh-token",
      })
    })

    await config.withUser(builder, async () => {
      const response = await config.api.ai.fetchSlackAppConfig()
      expect(response.configured).toBe(true)

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

      jest.spyOn(global, "fetch").mockImplementation(async (url, init) => {
        expect(String(url)).toContain("/tooling.tokens.rotate")
        expect((init?.body as URLSearchParams).get("refresh_token")).toEqual(
          "xoxe-test-refresh-token"
        )
        return slackJsonResponse({
          ok: true,
          token: "xoxe-rotated-config-token",
          refresh_token: "xoxe-rotated-refresh-token",
          exp: Math.floor(Date.now() / 1000) + 43200,
        })
      })

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

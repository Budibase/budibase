import { TestConfiguration } from "../../../../tests"

jest.unmock("node-fetch")

describe("/api/system/environment", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/system/environment", () => {
    it("returns the expected environment", async () => {
      const env = await config.api.environment.getEnvironment()
      expect(env.body).toEqual({
        cloud: true,
        disableAccountPortal: false,
        isDev: false,
        multiTenancy: true,
        baseUrl: "http://localhost:10000",
        offlineMode: false,
        maintenance: [],
      })
    })

    it("returns the expected environment for self hosters", async () => {
      await config.withEnv({ SELF_HOSTED: true }, async () => {
        const env = await config.api.environment.getEnvironment()
        expect(env.body).toEqual({
          cloud: false,
          disableAccountPortal: false,
          isDev: false,
          multiTenancy: true,
          baseUrl: "http://localhost:10000",
          offlineMode: false,
          maintenance: [],
        })
      })
    })
  })
})

import { TestConfiguration, API } from "../../../../tests"

describe("/api/system/environment", () => {
  const config = new TestConfiguration()
  const api = new API(config)

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
      const env = await api.environment.getEnvironment()
      expect(env.body).toEqual({
        cloud: true,
        disableAccountPortal: false,
        isDev: false,
        multiTenancy: true,
      })
    })
  })
})

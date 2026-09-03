import { withEnv } from "../../../../environment"
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
        passwordPolicy: {
          minLength: 12,
          maxLength: 512,
        },
      })
    })

    it("returns the expected environment for self hosters", async () => {
      await withEnv({ SELF_HOSTED: true }, async () => {
        const env = await config.api.environment.getEnvironment()
        expect(env.body).toEqual({
          cloud: false,
          disableAccountPortal: false,
          isDev: false,
          multiTenancy: true,
          baseUrl: "http://localhost:10000",
          offlineMode: false,
          maintenance: [],
          passwordPolicy: {
            minLength: 12,
            maxLength: 512,
          },
        })
      })
    })

    it("returns the legacy password minimum length", async () => {
      await withEnv({ PASSWORD_MIN_LENGTH: "10" }, async () => {
        const env = await config.api.environment.getEnvironment()

        expect(env.body.passwordMinLength).toBe("10")
      })
    })
  })
})

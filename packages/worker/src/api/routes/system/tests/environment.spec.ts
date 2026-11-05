import { env as coreEnv } from "@budibase/backend-core"
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
        passwordMinLength: "12",
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
          passwordMinLength: "12",
          passwordPolicy: {
            minLength: 12,
            maxLength: 512,
          },
        })
      })
    })

    it.each([
      [undefined, false],
      ["0", false],
      ["1", true],
      ["true", true],
    ])("reports offline mode %s as %s", async (offlineMode, expected) => {
      const previousOfflineMode = coreEnv.OFFLINE_MODE
      coreEnv._set("OFFLINE_MODE", offlineMode)
      try {
        const env = await config.api.environment.getEnvironment()
        expect(env.body.offlineMode).toBe(expected)
      } finally {
        coreEnv._set("OFFLINE_MODE", previousOfflineMode)
      }
    })
  })
})

import { generator, structures } from "../../../tests"
import { DBTestConfiguration, testEnv } from "../../../tests/extra"
import { ConfigType } from "@budibase/types"
import env from "../../environment"
import * as configs from "../configs"

const DEFAULT_URL = "http://localhost:10000"
const ENV_URL = "http://env.com"

describe("configs", () => {
  const config = new DBTestConfiguration()

  const setDbPlatformUrl = async (dbUrl: string) => {
    const settingsConfig = {
      _id: configs.generateConfigID(ConfigType.SETTINGS),
      type: ConfigType.SETTINGS,
      config: {
        platformUrl: dbUrl,
      },
    }
    await configs.save(settingsConfig)
  }

  beforeEach(async () => {
    config.newTenant()
  })

  describe("getPlatformUrl", () => {
    describe("self host", () => {
      beforeEach(async () => {
        testEnv.selfHosted()
      })

      it("gets the default url", async () => {
        await config.doInTenant(async () => {
          const url = await configs.getPlatformUrl()
          expect(url).toBe(DEFAULT_URL)
        })
      })

      it("gets the platform url from the environment", async () => {
        await config.doInTenant(async () => {
          env._set("PLATFORM_URL", ENV_URL)
          const url = await configs.getPlatformUrl()
          expect(url).toBe(ENV_URL)
        })
      })

      it("gets the platform url from the database", async () => {
        await config.doInTenant(async () => {
          const dbUrl = generator.url()
          await setDbPlatformUrl(dbUrl)
          const url = await configs.getPlatformUrl()
          expect(url).toBe(dbUrl)
        })
      })
    })

    describe("cloud", () => {
      function getTenantAwareUrl() {
        return `http://${config.tenantId}.env.com`
      }

      beforeEach(async () => {
        testEnv.cloudHosted()
        testEnv.multiTenant()

        env._set("PLATFORM_URL", ENV_URL)
      })

      it("gets the platform url from the environment without tenancy", async () => {
        await config.doInTenant(async () => {
          const url = await configs.getPlatformUrl({ tenantAware: false })
          expect(url).toBe(ENV_URL)
        })
      })

      it("gets the platform url from the environment with tenancy", async () => {
        await config.doInTenant(async () => {
          const url = await configs.getPlatformUrl()
          expect(url).toBe(getTenantAwareUrl())
        })
      })

      it("never gets the platform url from the database", async () => {
        await config.doInTenant(async () => {
          await setDbPlatformUrl(generator.url())
          const url = await configs.getPlatformUrl()
          expect(url).toBe(getTenantAwareUrl())
        })
      })
    })
  })

  describe("getSettingsConfig", () => {
    beforeAll(async () => {
      testEnv.selfHosted()
      env._set("PLATFORM_URL", "")
    })

    it("returns the platform url with an existing config", async () => {
      await config.doInTenant(async () => {
        const dbUrl = generator.url()
        await setDbPlatformUrl(dbUrl)
        const config = await configs.getSettingsConfig()
        expect(config.platformUrl).toBe(dbUrl)
      })
    })

    it("returns the platform url without an existing config", async () => {
      await config.doInTenant(async () => {
        const config = await configs.getSettingsConfig()
        expect(config.platformUrl).toBe(DEFAULT_URL)
      })
    })
  })

  describe("getGoogleDatasourceConfig", () => {
    function setEnvVars() {
      env.GOOGLE_CLIENT_SECRET = "test"
      env.GOOGLE_CLIENT_ID = "test"
    }

    function unsetEnvVars() {
      env.GOOGLE_CLIENT_SECRET = undefined
      env.GOOGLE_CLIENT_ID = undefined
    }

    describe("cloud", () => {
      beforeEach(() => {
        testEnv.cloudHosted()
      })

      it("returns from env vars", async () => {
        await config.doInTenant(async () => {
          setEnvVars()
          const config = await configs.getGoogleDatasourceConfig()
          unsetEnvVars()

          expect(config).toEqual({
            activated: true,
            clientID: "test",
            clientSecret: "test",
          })
        })
      })

      it("returns undefined when no env vars are configured", async () => {
        await config.doInTenant(async () => {
          const config = await configs.getGoogleDatasourceConfig()
          expect(config).toBeUndefined()
        })
      })
    })

    describe("self host", () => {
      beforeEach(() => {
        testEnv.selfHosted()
      })

      it("returns from config", async () => {
        await config.doInTenant(async () => {
          const googleDoc = structures.sso.googleConfigDoc()
          await configs.save(googleDoc)
          const config = await configs.getGoogleDatasourceConfig()
          expect(config).toEqual(googleDoc.config)
        })
      })

      it("falls back to env vars when config is disabled", async () => {
        await config.doInTenant(async () => {
          setEnvVars()
          const config = await configs.getGoogleDatasourceConfig()
          unsetEnvVars()
          expect(config).toEqual({
            activated: true,
            clientID: "test",
            clientSecret: "test",
          })
        })
      })
    })
  })
})

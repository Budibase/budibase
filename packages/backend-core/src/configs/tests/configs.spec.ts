import { DBTestConfiguration, generator, testEnv } from "../../../tests"
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
})

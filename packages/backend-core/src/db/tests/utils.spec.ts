import { generator, DBTestConfiguration, testEnv } from "../../../tests"
import {
  getDevelopmentAppID,
  getProdAppID,
  isDevAppID,
  isProdAppID,
} from "../conversions"
import { generateAppID, getPlatformUrl, getScopedConfig } from "../utils"
import * as context from "../../context"
import { Config } from "../../constants"
import env from "../../environment"

describe("utils", () => {
  const config = new DBTestConfiguration()

  describe("app ID manipulation", () => {
    function getID() {
      const appId = generateAppID()
      const split = appId.split("_")
      const uuid = split[split.length - 1]
      const devAppId = `app_dev_${uuid}`
      return { appId, devAppId, split, uuid }
    }

    it("should be able to generate a new app ID", () => {
      expect(generateAppID().startsWith("app_")).toEqual(true)
    })

    it("should be able to convert a production app ID to development", () => {
      const { appId, uuid } = getID()
      expect(getDevelopmentAppID(appId)).toEqual(`app_dev_${uuid}`)
    })

    it("should be able to convert a development app ID to development", () => {
      const { devAppId, uuid } = getID()
      expect(getDevelopmentAppID(devAppId)).toEqual(`app_dev_${uuid}`)
    })

    it("should be able to convert a development ID to a production", () => {
      const { devAppId, uuid } = getID()
      expect(getProdAppID(devAppId)).toEqual(`app_${uuid}`)
    })

    it("should be able to convert a production ID to production", () => {
      const { appId, uuid } = getID()
      expect(getProdAppID(appId)).toEqual(`app_${uuid}`)
    })

    it("should be able to confirm dev app ID is development", () => {
      const { devAppId } = getID()
      expect(isDevAppID(devAppId)).toEqual(true)
    })

    it("should be able to confirm prod app ID is not development", () => {
      const { appId } = getID()
      expect(isDevAppID(appId)).toEqual(false)
    })

    it("should be able to confirm prod app ID is prod", () => {
      const { appId } = getID()
      expect(isProdAppID(appId)).toEqual(true)
    })

    it("should be able to confirm dev app ID is not prod", () => {
      const { devAppId } = getID()
      expect(isProdAppID(devAppId)).toEqual(false)
    })
  })

  const DEFAULT_URL = "http://localhost:10000"
  const ENV_URL = "http://env.com"

  const setDbPlatformUrl = async (dbUrl: string) => {
    const db = context.getGlobalDB()
    await db.put({
      _id: "config_settings",
      type: Config.SETTINGS,
      config: {
        platformUrl: dbUrl,
      },
    })
  }

  const clearSettingsConfig = async () => {
    await config.doInTenant(async () => {
      const db = context.getGlobalDB()
      try {
        const config = await db.get("config_settings")
        await db.remove("config_settings", config._rev)
      } catch (e: any) {
        if (e.status !== 404) {
          throw e
        }
      }
    })
  }

  describe("getPlatformUrl", () => {
    describe("self host", () => {
      beforeEach(async () => {
        testEnv.selfHosted()
        await clearSettingsConfig()
      })

      it("gets the default url", async () => {
        await config.doInTenant(async () => {
          const url = await getPlatformUrl()
          expect(url).toBe(DEFAULT_URL)
        })
      })

      it("gets the platform url from the environment", async () => {
        await config.doInTenant(async () => {
          env._set("PLATFORM_URL", ENV_URL)
          const url = await getPlatformUrl()
          expect(url).toBe(ENV_URL)
        })
      })

      it("gets the platform url from the database", async () => {
        await config.doInTenant(async () => {
          const dbUrl = generator.url()
          await setDbPlatformUrl(dbUrl)
          const url = await getPlatformUrl()
          expect(url).toBe(dbUrl)
        })
      })
    })

    describe("cloud", () => {
      const TENANT_AWARE_URL = `http://${config.tenantId}.env.com`

      beforeEach(async () => {
        testEnv.cloudHosted()
        testEnv.multiTenant()

        env._set("PLATFORM_URL", ENV_URL)
        await clearSettingsConfig()
      })

      it("gets the platform url from the environment without tenancy", async () => {
        await config.doInTenant(async () => {
          const url = await getPlatformUrl({ tenantAware: false })
          expect(url).toBe(ENV_URL)
        })
      })

      it("gets the platform url from the environment with tenancy", async () => {
        await config.doInTenant(async () => {
          const url = await getPlatformUrl()
          expect(url).toBe(TENANT_AWARE_URL)
        })
      })

      it("never gets the platform url from the database", async () => {
        await config.doInTenant(async () => {
          await setDbPlatformUrl(generator.url())
          const url = await getPlatformUrl()
          expect(url).toBe(TENANT_AWARE_URL)
        })
      })
    })
  })

  describe("getScopedConfig", () => {
    describe("settings config", () => {
      beforeEach(async () => {
        env._set("SELF_HOSTED", 1)
        env._set("PLATFORM_URL", "")
        await clearSettingsConfig()
      })

      it("returns the platform url with an existing config", async () => {
        await config.doInTenant(async () => {
          const dbUrl = generator.url()
          await setDbPlatformUrl(dbUrl)
          const db = context.getGlobalDB()
          const config = await getScopedConfig(db, { type: Config.SETTINGS })
          expect(config.platformUrl).toBe(dbUrl)
        })
      })

      it("returns the platform url without an existing config", async () => {
        await config.doInTenant(async () => {
          const db = context.getGlobalDB()
          const config = await getScopedConfig(db, { type: Config.SETTINGS })
          expect(config.platformUrl).toBe(DEFAULT_URL)
        })
      })
    })
  })
})

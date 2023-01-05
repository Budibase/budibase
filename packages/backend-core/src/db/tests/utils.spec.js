require("../../../tests")
const {
  getDevelopmentAppID,
  getProdAppID,
  isDevAppID,
  isProdAppID,
} = require("../conversions")
const {
  generateAppID,
  getPlatformUrl,
  getScopedConfig
} = require("../utils")
const tenancy = require("../../tenancy")
const { Config, DEFAULT_TENANT_ID } = require("../../constants")
const env = require("../../environment")

describe("utils", () => {
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
})

const DB_URL = "http://dburl.com"
const DEFAULT_URL = "http://localhost:10000"
const ENV_URL = "http://env.com"

const setDbPlatformUrl = async () => {
  const db = tenancy.getGlobalDB()
  db.put({
    _id: "config_settings",
    type: Config.SETTINGS,
    config: {
      platformUrl: DB_URL
    }
  })
}

const clearSettingsConfig = async () => {
  await tenancy.doInTenant(DEFAULT_TENANT_ID, async () => {
    const db = tenancy.getGlobalDB()
    try {
      const config = await db.get("config_settings")
      await db.remove("config_settings", config._rev)
    } catch (e) {
      if (e.status !== 404) {
        throw e
      }
    }
  })
}
 
describe("getPlatformUrl", () => {
  describe("self host", () => {

    beforeEach(async () => {
      env._set("SELF_HOST", 1)
      await clearSettingsConfig()
    })

    it("gets the default url", async () => {
      await tenancy.doInTenant(null, async () => {
        const url = await getPlatformUrl()
        expect(url).toBe(DEFAULT_URL)
      })
    })

    it("gets the platform url from the environment", async () => {
      await tenancy.doInTenant(null, async () => {
        env._set("PLATFORM_URL", ENV_URL)
        const url = await getPlatformUrl()
        expect(url).toBe(ENV_URL)
      })
    })

    it("gets the platform url from the database", async () => {
      await tenancy.doInTenant(null, async () => {
        await setDbPlatformUrl()
        const url = await getPlatformUrl()
        expect(url).toBe(DB_URL)
      })
    })    
  })


  describe("cloud", () => {
    const TENANT_AWARE_URL = "http://default.env.com"

    beforeEach(async () => {
      env._set("SELF_HOSTED", 0)
      env._set("MULTI_TENANCY", 1)
      env._set("PLATFORM_URL", ENV_URL)
      await clearSettingsConfig()
    })

    it("gets the platform url from the environment without tenancy", async () => {
      await tenancy.doInTenant(DEFAULT_TENANT_ID, async () => {
        const url = await getPlatformUrl({ tenantAware: false })
        expect(url).toBe(ENV_URL)
      })
    })

    it("gets the platform url from the environment with tenancy", async () => {
      await tenancy.doInTenant(DEFAULT_TENANT_ID, async () => {
        const url = await getPlatformUrl()
        expect(url).toBe(TENANT_AWARE_URL)
      })
    })

    it("never gets the platform url from the database", async () => {
      await tenancy.doInTenant(DEFAULT_TENANT_ID, async () => {
        await setDbPlatformUrl()
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
      await tenancy.doInTenant(DEFAULT_TENANT_ID, async () => {
        await setDbPlatformUrl()
        const db = tenancy.getGlobalDB()
        const config = await getScopedConfig(db, { type: Config.SETTINGS })
        expect(config.platformUrl).toBe(DB_URL)
      })
    })

    it("returns the platform url without an existing config", async () => {
      await tenancy.doInTenant(DEFAULT_TENANT_ID, async () => {
        const db = tenancy.getGlobalDB()
        const config = await getScopedConfig(db, { type: Config.SETTINGS })
        expect(config.platformUrl).toBe(DEFAULT_URL)
      })
    })
  })
})

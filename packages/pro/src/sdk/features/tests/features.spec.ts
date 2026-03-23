import { mocks } from "../../../../tests"
import * as features from "../features"
import { env, configs as _configs } from "@budibase/backend-core"
import { SettingsInnerConfig } from "@budibase/types"

jest.mock("@budibase/backend-core", () => {
  return {
    ...jest.requireActual("@budibase/backend-core"),
    configs: {
      getSettingsConfig: jest.fn(),
    },
  }
})

const configs = jest.mocked(_configs)

describe("features", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mocks.licenses.useEnforceableSSO()
    env.ENABLE_SSO_MAINTENANCE_MODE = false
  })

  describe("isEnforceableSSO", () => {
    it("returns true when enabled", async () => {
      const result = await features.isEnforceableSSO()
      expect(result).toBe(true)
    })

    it("returns true when enabled with cloud free license", async () => {
      mocks.licenses.useCloudFree()
      const result = await features.isEnforceableSSO()
      expect(result).toBe(false)
    })
  })

  describe("isSSOEnforced", () => {
    it("returns false in maintenance mode", async () => {
      env.ENABLE_SSO_MAINTENANCE_MODE = true
      const result = await features.isSSOEnforced()
      expect(result).toBe(false)
    })

    it("returns false when feature is disabled", async () => {
      mocks.licenses.useCloudFree()
      const result = await features.isSSOEnforced()
      expect(result).toBe(false)
    })

    it("return value from read config", async () => {
      let config: SettingsInnerConfig = {
        isSSOEnforced: true,
      }
      configs.getSettingsConfig.mockReturnValueOnce(Promise.resolve(config))
      const result = await features.isSSOEnforced()
      expect(result).toBe(true)
    })

    it("return value from provided config", async () => {
      let config: SettingsInnerConfig = {
        // vary from above
        isSSOEnforced: false,
      }
      const result = await features.isSSOEnforced({ config })
      expect(result).toBe(false)
    })
  })
})

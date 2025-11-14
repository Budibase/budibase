import { structures } from "../../../tests"
import { lockTenant, unlockTenant } from "../tenants"
import { configs, tenancy } from "@budibase/backend-core"
import { LockReason, ConfigType, SettingsConfig } from "@budibase/types"

// Mock the backend-core modules
jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    tenancy: {
      ...actual.tenancy,
      getTenantDB: jest.fn(),
      getGlobalDBName: jest.fn(),
    },
    configs: {
      ...actual.configs,
      generateConfigID: jest.fn(),
    },
    db: {
      ...actual.db,
      getAllWorkspaces: jest.fn(),
      getDB: jest.fn(),
      dbExists: jest.fn(),
      getGlobalUserParams: jest.fn(),
    },
    platform: {
      ...actual.platform,
      getPlatformDB: jest.fn(),
    },
  }
})

// Mock the pro module
jest.mock("@budibase/pro", () => ({
  quotas: {
    bustCache: jest.fn(),
  },
  constants: {
    licenses: {
      CLOUD_FREE_LICENSE: "CLOUD_FREE_LICENSE",
      UNLIMITED_LICENSE: "UNLIMITED_LICENSE",
    },
  },
  licensing: {
    cache: {
      getCachedLicense: jest.fn(),
    },
  },
}))

const mockDb = {
  put: jest.fn(),
  tryGet: jest.fn(),
}

const mockedTenancy = jest.mocked(tenancy)
const mockedConfigs = jest.mocked(configs)

describe("tenants", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Setup mock database
    mockedTenancy.getTenantDB.mockReturnValue(mockDb as any)
    // Setup mock config ID generation
    mockedConfigs.generateConfigID.mockReturnValue("config_settings")
  })

  describe("lockTenant", () => {
    it("should lock tenant with provided reason", async () => {
      const tenantId = structures.tenant.id()
      const lockReason = LockReason.FREE_TIER

      const settingsConfig: SettingsConfig = {
        _id: "config_settings",
        type: ConfigType.SETTINGS,
        config: {},
      }

      mockDb.tryGet.mockResolvedValue(settingsConfig)

      await lockTenant(tenantId, lockReason)

      expect(mockDb.tryGet).toHaveBeenCalledWith(
        configs.generateConfigID(ConfigType.SETTINGS)
      )
      expect(mockDb.put).toHaveBeenCalledWith({
        ...settingsConfig,
        config: {
          ...settingsConfig.config,
          lockedBy: lockReason,
        },
      })
    })

    it("should throw error when settings config not found", async () => {
      const tenantId = structures.tenant.id()
      const lockReason = LockReason.FREE_TIER

      mockDb.tryGet.mockResolvedValue(null)

      await expect(lockTenant(tenantId, lockReason)).rejects.toThrow(
        `Cannot lock. Settings config not found for tenant ${tenantId}`
      )
    })

    it("should throw error when settings config has no config property", async () => {
      const tenantId = structures.tenant.id()
      const lockReason = LockReason.FREE_TIER

      const settingsConfig = {
        _id: "config_settings",
        type: ConfigType.SETTINGS,
      }

      mockDb.tryGet.mockResolvedValue(settingsConfig)

      await expect(lockTenant(tenantId, lockReason)).rejects.toThrow(
        `Cannot lock. Settings config not found for tenant ${tenantId}`
      )
    })
  })

  describe("unlockTenant", () => {
    it("should unlock tenant by removing lock reason", async () => {
      const tenantId = structures.tenant.id()

      const settingsConfig: SettingsConfig = {
        _id: "config_settings",
        type: ConfigType.SETTINGS,
        config: {
          lockedBy: LockReason.FREE_TIER,
        },
      }

      mockDb.tryGet.mockResolvedValue(settingsConfig)

      await unlockTenant(tenantId)

      expect(mockDb.tryGet).toHaveBeenCalledWith(
        configs.generateConfigID(ConfigType.SETTINGS)
      )
      expect(mockDb.put).toHaveBeenCalledWith({
        ...settingsConfig,
        config: {
          ...settingsConfig.config,
          lockedBy: undefined,
        },
      })
    })

    it("should throw error when settings config not found", async () => {
      const tenantId = structures.tenant.id()

      mockDb.tryGet.mockResolvedValue(null)

      await expect(unlockTenant(tenantId)).rejects.toThrow(
        `Cannot lock. Settings config not found for tenant ${tenantId}`
      )
    })
  })
})

const getTenantId = jest.fn()
jest.mock("@budibase/backend-core/tenancy", () => ({
  getTenantId
}))
const usageQuota = require("../../usageQuota")
const env = require("../../../environment")

class TestConfiguration {
  constructor() {
    this.enableQuotas()
  }

  enableQuotas = () => {
    env.USE_QUOTAS = 1
  }

  disableQuotas = () => {
    env.USE_QUOTAS = null
  }

  setTenantId = (tenantId) => {
    getTenantId.mockReturnValue(tenantId)
  } 

  setExcludedTenants = (tenants) => {
    env.EXCLUDE_QUOTAS_TENANTS = tenants
  }

  reset = () => {
    this.disableQuotas()
    this.setExcludedTenants(null)
  }
}

describe("usageQuota", () => {
  let config

  beforeEach(() => {
    config = new TestConfiguration()
  })

  afterEach(() => {
    config.reset()
  })

  describe("useQuotas", () => {
    it("works when no settings have been provided", () => {
      config.reset()
      expect(usageQuota.useQuotas()).toBe(false)
    })
    it("honours USE_QUOTAS setting", () => {
      config.disableQuotas()
      expect(usageQuota.useQuotas()).toBe(false)

      config.enableQuotas()
      expect(usageQuota.useQuotas()).toBe(true)
    })
    it("honours EXCLUDE_QUOTAS_TENANTS setting", () => {
      config.setTenantId("test")

      // tenantId is in the list
      config.setExcludedTenants("test, test2, test2")
      expect(usageQuota.useQuotas()).toBe(false)
      config.setExcludedTenants("test,test2,test2")
      expect(usageQuota.useQuotas()).toBe(false)

      // tenantId is not in the list
      config.setTenantId("other")
      expect(usageQuota.useQuotas()).toBe(true)
    })
  })
})
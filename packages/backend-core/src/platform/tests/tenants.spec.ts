import { structures } from "../../../tests"
import { DBTestConfiguration } from "../../../tests/extra"
import * as tenants from "../tenants"

describe("tenants", () => {
  const config = new DBTestConfiguration()

  describe("addTenant", () => {
    it("concurrently adds multiple tenants safely", async () => {
      const tenant1 = structures.tenant.id()
      const tenant2 = structures.tenant.id()
      const tenant3 = structures.tenant.id()

      await Promise.all([
        tenants.addTenant(tenant1),
        tenants.addTenant(tenant2),
        tenants.addTenant(tenant3),
      ])

      const tenantIds = await tenants.getTenantIds()
      expect(tenantIds.includes(tenant1)).toBe(true)
      expect(tenantIds.includes(tenant2)).toBe(true)
      expect(tenantIds.includes(tenant3)).toBe(true)
    })
  })
})

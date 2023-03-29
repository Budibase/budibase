import { TestConfiguration } from "../../../../tests"
import { tenancy } from "@budibase/backend-core"

describe("/api/global/tenants", () => {
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

  describe("DELETE /api/system/tenants/:tenantId", () => {
    it("allows deleting the current tenant", async () => {
      const user = await config.createTenant()

      await config.api.tenants.delete(user.tenantId, {
        headers: config.authHeaders(user),
      })
    })

    it("rejects deleting another tenant", async () => {
      const user1 = await config.createTenant()
      // create a second user in another tenant
      const user2 = await config.createTenant()

      const status = 403
      const res = await config.api.tenants.delete(user1.tenantId, {
        status,
        headers: config.authHeaders(user2),
      })

      expect(res.body).toEqual({
        message: "Tenant ID does not match current user",
        status,
      })
    })

    it("rejects non-admin", async () => {
      const user1 = await config.createTenant()
      // create an internal non-admin user
      const user2 = await tenancy.doInTenant(user1.tenantId, () => {
        return config.createUser()
      })
      await config.createSession(user2)

      const res = await config.api.tenants.delete(user1.tenantId, {
        status: 403,
        headers: config.authHeaders(user2),
      })

      expect(res.body).toEqual(config.adminOnlyResponse())
    })
  })
})

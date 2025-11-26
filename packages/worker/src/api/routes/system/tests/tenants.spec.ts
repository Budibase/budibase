import { TestConfiguration } from "../../../../tests"
import { tenancy } from "@budibase/backend-core"
import { LockReason } from "@budibase/types"
import * as tenantSdk from "../../../../sdk/tenants"

jest.mock("../../../../sdk/tenants", () => ({
  lockTenant: jest.fn(),
  unlockTenant: jest.fn(),
  deleteTenant: jest.fn(),
  setActivation: jest.fn(),
}))

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

  describe("PUT /api/system/tenants/:tenantId/lock", () => {
    it("allows locking tenant with valid reason", async () => {
      const user = await config.createTenant()

      await config.api.tenants.lock(
        user.tenantId,
        {
          reason: LockReason.FREE_TIER,
        },
        {
          headers: config.internalAPIHeaders(),
        }
      )

      expect(tenantSdk.lockTenant).toHaveBeenCalledWith(
        user.tenantId,
        LockReason.FREE_TIER
      )
      expect(tenantSdk.unlockTenant).not.toHaveBeenCalled()
    })

    it("unlocks tenant when no reason provided", async () => {
      const user = await config.createTenant()

      await config.api.tenants.lock(
        user.tenantId,
        {},
        {
          headers: config.internalAPIHeaders(),
        }
      )

      expect(tenantSdk.unlockTenant).toHaveBeenCalledWith(user.tenantId)
      expect(tenantSdk.lockTenant).not.toHaveBeenCalled()
    })

    it("rejects invalid lock reason", async () => {
      const user = await config.createTenant()

      const status = 400
      const res = await config.api.tenants.lock(
        user.tenantId,
        {
          reason: "invalid_reason" as any,
        },
        {
          status,
          headers: config.internalAPIHeaders(),
        }
      )

      expect(res.body.message).toContain("Invalid lock reason. Valid values:")
      expect(res.body.message).toContain(LockReason.FREE_TIER)
      expect(tenantSdk.lockTenant).not.toHaveBeenCalled()
      expect(tenantSdk.unlockTenant).not.toHaveBeenCalled()
    })

    it("rejects non-internal user", async () => {
      const user = await config.createTenant()

      const status = 403
      const res = await config.api.tenants.lock(
        user.tenantId,
        {
          reason: LockReason.FREE_TIER,
        },
        {
          status,
          headers: config.authHeaders(user),
        }
      )

      expect(res.body).toEqual({
        message: "Only internal user can lock a tenant",
        status,
      })
      expect(tenantSdk.lockTenant).not.toHaveBeenCalled()
      expect(tenantSdk.unlockTenant).not.toHaveBeenCalled()
    })
  })

  describe("PUT /api/system/tenants/:tenantId/activation", () => {
    it("allows activating tenant", async () => {
      const user = await config.createTenant()

      await config.api.tenants.activation(
        user.tenantId,
        {
          active: true,
        },
        {
          headers: config.internalAPIHeaders(),
        }
      )

      expect(tenantSdk.setActivation).toHaveBeenCalledWith(user.tenantId, true)
    })

    it("allows deactivating tenant", async () => {
      const user = await config.createTenant()

      await config.api.tenants.activation(
        user.tenantId,
        {
          active: false,
        },
        {
          headers: config.internalAPIHeaders(),
        }
      )

      expect(tenantSdk.setActivation).toHaveBeenCalledWith(user.tenantId, false)
    })

    it("rejects non-boolean active value", async () => {
      const user = await config.createTenant()

      const status = 403
      const res = await config.api.tenants.activation(
        user.tenantId,
        {
          active: "invalid" as any,
        },
        {
          status,
          headers: config.internalAPIHeaders(),
        }
      )

      expect(res.body).toEqual({
        message: "Only boolean values allowed for 'active' property",
        status,
      })
      expect(tenantSdk.setActivation).not.toHaveBeenCalled()
    })

    it("rejects non-internal user", async () => {
      const user = await config.createTenant()

      const status = 403
      const res = await config.api.tenants.activation(
        user.tenantId,
        {
          active: true,
        },
        {
          status,
          headers: config.authHeaders(user),
        }
      )

      expect(res.body).toEqual({
        message: "Only internal user can set activation for a tenant",
        status,
      })
      expect(tenantSdk.setActivation).not.toHaveBeenCalled()
    })
  })
})

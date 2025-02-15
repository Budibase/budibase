import ensureTenantAppOwnership from "../ensureTenantAppOwnership"
import { tenancy } from "@budibase/backend-core"

jest.mock("@budibase/backend-core", () => ({
  tenancy: {
    getTenantId: jest.fn(),
    getTenantIDFromAppID: jest.fn(),
  },
}))

class TestConfiguration {
  constructor() {
    this.next = jest.fn()
    this.throw = jest.fn()
    this.middleware = ensureTenantAppOwnership(() => "app_123")

    this.ctx = {
      next: this.next,
      throw: this.throw,
    }
  }

  executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }

  afterEach() {
    jest.clearAllMocks()
  }
}

describe("Ensure Tenant Ownership Middleware", () => {
  let config

  beforeEach(() => {
    config = new TestConfiguration()
  })

  afterEach(() => {
    config.afterEach()
  })

  it("calls next() when tenant IDs match", async () => {
    tenancy.getTenantIDFromAppID.mockReturnValue("tenant_1")
    tenancy.getTenantId.mockReturnValue("tenant_1")

    await config.executeMiddleware()
    expect(config.next).toHaveBeenCalled()
  })

  it("throws 403 when tenant IDs do not match", async () => {
    tenancy.getTenantIDFromAppID.mockReturnValue("tenant_2")
    tenancy.getTenantId.mockReturnValue("tenant_1")

    await config.executeMiddleware()
    expect(config.throw).toHaveBeenCalledWith(
      403,
      "Cannot export app from another tenant"
    )
  })
})
